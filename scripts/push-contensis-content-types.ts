/**
 * Push Contensis content types and CMS-only components to the Management API.
 *
 * Usage: npx tsx scripts/push-contensis-content-types.ts
 *
 * CMS_ONLY_COMPONENTS — Contensis components with no React equivalent (e.g. metaComponent).
 *   Pushed first so content types can reference them.
 *
 * CONTENT_TYPES — Entry schemas that editors create records from (e.g. Person, Article).
 *   Pushed in order — dependencies before dependants.
 *
 * COMPONENT_MIGRATIONS — handles the edge case where a content type ID was previously
 *   used as a component ID. See inline docs for the 4-step migration flow.
 *
 * Requires .env with: CONTENSIS_ROOT_URL, CONTENSIS_PROJECT_ID,
 * CONTENSIS_CLIENT_ID, CONTENSIS_CLIENT_SECRET
 */

import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UniversalClient } from 'contensis-management-api';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { CONTENSIS_ROOT_URL, CONTENSIS_PROJECT_ID, CONTENSIS_CLIENT_ID, CONTENSIS_CLIENT_SECRET } =
  process.env;

if (!CONTENSIS_ROOT_URL || !CONTENSIS_PROJECT_ID || !CONTENSIS_CLIENT_ID || !CONTENSIS_CLIENT_SECRET) {
  console.error('ERROR: Missing required environment variables. Check your .env file.');
  process.exit(1);
}

/* ============================================
   CMS-only components
   Contensis components with no React equivalent.
   Pushed before content types so they can be referenced.
   ============================================ */

const CMS_ONLY_COMPONENTS: any[] = [
  // Add CMS-only component definitions here.
  // e.g. metaComponent (SEO metadata component used in content types but not rendered directly)
];

/* ============================================
   Content type definitions
   Add new entry schemas here in dependency order
   (dependencies before dependants).
   ============================================ */

const CONTENT_TYPES: any[] = [
  // Add content type definitions here.
  // e.g. Person, Category, Article
];

/**
 * Components whose fields reference the content type ID as a component ref.
 * These need a transitional push (breaking the component ref) before the
 * stale component can be deleted, then a final push once the content type exists.
 *
 * Add entries here when a content type ID was previously used as a component ID.
 * Remove entries once the migration has run successfully.
 */
const COMPONENT_MIGRATIONS: Record<string, Array<{ jsonPath: string; fieldId: string }>> = {};

/* ============================================
   Auth helper — get bearer token via raw fetch
   ============================================ */

async function getBearerToken(): Promise<string> {
  const tokenUrl = `${CONTENSIS_ROOT_URL}/authenticate/connect/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CONTENSIS_CLIENT_ID!,
    client_secret: CONTENSIS_CLIENT_SECRET!,
    scope: 'Security_Administrator ContentType_Read ContentType_Write ContentType_Delete',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  }

  const data: any = await res.json();
  return data.access_token;
}

/* ============================================
   Delete a component by ID via raw HTTP
   ============================================ */

async function deleteComponent(id: string, token: string): Promise<boolean> {
  const url = `${CONTENSIS_ROOT_URL}/api/management/projects/${CONTENSIS_PROJECT_ID}/components/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200 || res.status === 204) {
    console.log(`  DELETED stale component: ${id}`);
    return true;
  } else if (res.status === 404) {
    return false; // Not found — already gone
  } else {
    const text = await res.text();
    console.warn(`  WARN: DELETE component ${id} returned ${res.status}: ${text}`);
    return false;
  }
}

/* ============================================
   Push/update a component by JSON model
   ============================================ */

async function pushComponent(
  client: ReturnType<typeof UniversalClient.create>,
  model: any,
  label: string,
): Promise<void> {
  let component: any;
  try {
    component = await client.components.create(model);
    console.log(`  CREATED: ${label}`);
  } catch (err: any) {
    const status = err?.status ?? err?.cause?.status;
    if (status === 409) {
      const existing = await client.components.get(model.id);
      const updateModel = { ...model, version: existing.version };
      component = await client.components.update(updateModel);
      console.log(`  UPDATED: ${label}`);
    } else {
      throw err;
    }
  }

  // Publish so Contensis refreshes its dependency graph
  if (component) {
    try {
      await client.components.invokeWorkflow(component, 'component.publish');
      console.log(`    published ✓`);
    } catch {
      try {
        await client.components.invokeWorkflow(component, 'publish');
        console.log(`    published ✓`);
      } catch {
        // Already published or workflow name differs — ignore
      }
    }
  }
}

/* ============================================
   Main
   ============================================ */

async function main() {
  console.log(`Connecting to ${CONTENSIS_ROOT_URL} (project: ${CONTENSIS_PROJECT_ID})...\n`);

  const token = await getBearerToken();

  const client = UniversalClient.create({
    clientType: 'client_credentials',
    clientDetails: {
      clientId: CONTENSIS_CLIENT_ID!,
      clientSecret: CONTENSIS_CLIENT_SECRET!,
    },
    projectId: CONTENSIS_PROJECT_ID!,
    rootUrl: CONTENSIS_ROOT_URL!,
  });

  let errors = 0;

  // ---- Step A: Push CMS-only components first ----
  if (CMS_ONLY_COMPONENTS.length > 0) {
    console.log('--- CMS-only components ---\n');
    for (const spec of CMS_ONLY_COMPONENTS) {
      const model = { ...spec, projectId: CONTENSIS_PROJECT_ID! };
      try {
        await pushComponent(client, model, spec.name['en-GB']);
      } catch (e: any) {
        console.error(
          `  ERROR pushing component "${spec.id}":`,
          JSON.stringify(e?.data ?? e?.message ?? e, null, 2),
        );
        errors++;
      }
    }
  }

  // ---- Step B: Push content types ----
  console.log('\n--- Content types ---\n');

  let created = 0;
  let updated = 0;

  for (const spec of CONTENT_TYPES) {
    const model = { ...spec, projectId: CONTENSIS_PROJECT_ID! };
    let contentType: any = null;
    const migrations = COMPONENT_MIGRATIONS[spec.id] ?? [];

    // Migration step 1: break stale component references
    if (migrations.length > 0) {
      console.log(`  [Migration 1] Breaking stale component references for "${spec.id}"...`);
      for (const { jsonPath, fieldId } of migrations) {
        if (!fs.existsSync(jsonPath)) {
          console.warn(`  WARN: JSON not found at ${jsonPath} — skipping transition`);
          continue;
        }
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const componentModel = JSON.parse(raw.replace(/\{\{projectId\}\}/g, CONTENSIS_PROJECT_ID!));

        const transitionModel = {
          ...componentModel,
          fields: componentModel.fields.map((f: any) => {
            if (f.id !== fieldId) return f;
            const { allowedContentTypes: _, ...restValidations } = f.validations ?? {};
            return { ...f, validations: restValidations };
          }),
        };

        try {
          await pushComponent(client, transitionModel, `${path.basename(jsonPath)} (transition)`);
        } catch (e: any) {
          console.error(
            `  ERROR pushing transition for ${jsonPath}:`,
            JSON.stringify(e?.data ?? e?.message ?? e, null, 2),
          );
          errors++;
        }
      }

      // Migration step 2: delete the stale component
      console.log(`  [Migration 2] Deleting stale "${spec.id}" component...`);
      await deleteComponent(spec.id, token);
    }

    // Create/update content type
    try {
      contentType = await client.contentTypes.create(model);
      console.log(`  CREATED: ${spec.name['en-GB']} (${spec.id})`);
      created++;
    } catch (createError: any) {
      const status = createError?.status ?? createError?.cause?.status;
      if (status === 409) {
        try {
          const existing = await client.contentTypes.get(spec.id);
          const updateModel = { ...model, version: existing.version };
          contentType = await client.contentTypes.update(updateModel);
          console.log(`  UPDATED: ${spec.name['en-GB']} (${spec.id})`);
          updated++;
        } catch (updateError: any) {
          console.error(
            `  ERROR updating "${spec.id}":`,
            JSON.stringify(updateError?.data ?? updateError?.message ?? updateError, null, 2),
          );
          errors++;
        }
      } else {
        console.error(
          `  ERROR creating "${spec.id}":`,
          JSON.stringify(createError?.data ?? createError?.message ?? createError, null, 2),
        );
        errors++;
      }
    }

    // Publish content type
    if (contentType) {
      try {
        await client.contentTypes.invokeWorkflow(contentType, 'contentType.publish');
        console.log(`    published ✓`);
      } catch {
        try {
          await client.contentTypes.invokeWorkflow(contentType, 'publish');
          console.log(`    published ✓`);
        } catch {
          console.warn(`    WARN: Could not publish "${spec.id}" — may need manual publish`);
        }
      }
    }

    // Migration step 4: push final component versions with allowedContentTypes restored
    if (migrations.length > 0 && contentType) {
      console.log(`  [Migration 4] Restoring final component versions...`);
      for (const { jsonPath } of migrations) {
        if (!fs.existsSync(jsonPath)) continue;
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const componentModel = JSON.parse(raw.replace(/\{\{projectId\}\}/g, CONTENSIS_PROJECT_ID!));
        try {
          await pushComponent(client, componentModel, path.basename(jsonPath));
        } catch (e: any) {
          console.error(
            `  ERROR pushing final version for ${jsonPath}:`,
            JSON.stringify(e?.data ?? e?.message ?? e, null, 2),
          );
          errors++;
        }
      }
    }
  }

  console.log(
    `\nDone. ${created} content type(s) created, ${updated} updated, ${errors} error(s).`,
  );

  if (errors > 0) {
    process.exit(1);
  }
}

main();
