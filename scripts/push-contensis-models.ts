/**
 * Push Contensis component models to the Management API.
 *
 * Usage: npx tsx scripts/push-contensis-models.ts
 *
 * Reads all .contensis.json files, resolves dependency order
 * (children before parents), and creates/updates each component
 * via the Contensis Management API.
 *
 * Requires .env with: CONTENSIS_ROOT_URL, CONTENSIS_PROJECT_ID,
 * CONTENSIS_CLIENT_ID, CONTENSIS_CLIENT_SECRET
 */

import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UniversalClient } from 'contensis-management-api';
import { contentModelRegistry } from '../src/content-models/registry.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ============================================
   Environment validation
   ============================================ */

const { CONTENSIS_ROOT_URL, CONTENSIS_PROJECT_ID, CONTENSIS_CLIENT_ID, CONTENSIS_CLIENT_SECRET } =
  process.env;

if (!CONTENSIS_ROOT_URL || !CONTENSIS_PROJECT_ID || !CONTENSIS_CLIENT_ID || !CONTENSIS_CLIENT_SECRET) {
  console.error('ERROR: Missing required environment variables. Check your .env file.');
  console.error('Required: CONTENSIS_ROOT_URL, CONTENSIS_PROJECT_ID, CONTENSIS_CLIENT_ID, CONTENSIS_CLIENT_SECRET');
  process.exit(1);
}

/* ============================================
   ID overrides for reserved Contensis names
   Contensis has built-in asset types 'image' and 'video',
   so our component IDs must avoid those.
   ============================================ */

const ID_OVERRIDES: Record<string, string> = {
  image: 'imageBlock',
  video: 'videoBlock',
};

/* ============================================
   Registry name → directory mapping
   Add a new entry here whenever you add a component to the registry.
   ============================================ */

const REGISTRY_TO_DIR: Record<string, string> = {
  // e.g. Button: 'Button',
  // e.g. 'CTA Banner': 'CtaBanner',
};

/* ============================================
   Dependency ordering (topological sort)
   ============================================ */

function getOrderedComponents(): string[] {
  // Build dependency graph: component → set of dependencies
  const deps = new Map<string, Set<string>>();

  for (const [name, spec] of Object.entries(contentModelRegistry)) {
    const componentDeps = new Set<string>();
    for (const field of spec.fields) {
      if (field.componentRef) {
        componentDeps.add(field.componentRef);
      }
    }
    deps.set(name, componentDeps);
  }

  // Kahn's algorithm for topological sort
  const ordered: string[] = [];
  const remaining = new Map(deps);

  while (remaining.size > 0) {
    // Find components with no unresolved dependencies
    const ready: string[] = [];
    for (const [name, componentDeps] of remaining) {
      const unresolved = [...componentDeps].filter((d) => remaining.has(d));
      if (unresolved.length === 0) {
        ready.push(name);
      }
    }

    if (ready.length === 0) {
      console.error('ERROR: Circular dependency detected among:', [...remaining.keys()].join(', '));
      process.exit(1);
    }

    // Sort alphabetically within each level for deterministic ordering
    ready.sort();
    ordered.push(...ready);

    for (const name of ready) {
      remaining.delete(name);
    }
  }

  return ordered;
}

/* ============================================
   Main
   ============================================ */

async function main() {
  console.log(`Connecting to ${CONTENSIS_ROOT_URL} (project: ${CONTENSIS_PROJECT_ID})...\n`);

  const client = UniversalClient.create({
    clientType: 'client_credentials',
    clientDetails: {
      clientId: CONTENSIS_CLIENT_ID!,
      clientSecret: CONTENSIS_CLIENT_SECRET!,
    },
    projectId: CONTENSIS_PROJECT_ID!,
    rootUrl: CONTENSIS_ROOT_URL!,
  });

  const orderedNames = getOrderedComponents();
  const componentsDir = path.resolve(__dirname, '../src/components');

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const registryName of orderedNames) {
    const dirName = REGISTRY_TO_DIR[registryName];
    if (!dirName) {
      console.error(`  SKIP: No directory mapping for "${registryName}"`);
      skipped++;
      continue;
    }

    const jsonPath = path.join(componentsDir, dirName, `${dirName}.contensis.json`);
    if (!fs.existsSync(jsonPath)) {
      console.error(`  SKIP: No .contensis.json for "${registryName}" at ${jsonPath}`);
      skipped++;
      continue;
    }

    // Read and patch the model
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const model = JSON.parse(raw.replace(/\{\{projectId\}\}/g, CONTENSIS_PROJECT_ID!));

    // Apply ID overrides for reserved Contensis names
    if (ID_OVERRIDES[model.id]) {
      const oldId = model.id;
      model.id = ID_OVERRIDES[oldId];
      model.name = { 'en-GB': `${registryName}` };
    }

    let component: any = null;

    try {
      component = await client.components.create(model);
      console.log(`  CREATED: ${registryName} (${model.id})`);
      created++;
    } catch (createError: any) {
      // If component already exists, try to update it
      const status = createError?.status ?? createError?.cause?.status;
      if (status === 409) {
        try {
          // Fetch existing to get version info needed for update
          const existing = await client.components.get(model.id);
          model.version = existing.version;
          component = await client.components.update(model);
          console.log(`  UPDATED: ${registryName} (${model.id})`);
          updated++;
        } catch (updateError: any) {
          console.error(`  ERROR updating "${registryName}":`, JSON.stringify(updateError?.data ?? updateError?.message ?? updateError, null, 2));
          errors++;
        }
      } else {
        console.error(`  ERROR creating "${registryName}":`, JSON.stringify(createError?.data ?? createError?.message ?? createError, null, 2));
        errors++;
      }
    }

    // Publish the component so it can be referenced by parent components
    if (component) {
      try {
        await client.components.invokeWorkflow(component, 'component.publish');
        console.log(`    published ✓`);
      } catch (pubError: any) {
        // May already be published or workflow event name differs
        try {
          await client.components.invokeWorkflow(component, 'publish');
          console.log(`    published ✓`);
        } catch {
          console.warn(`    WARN: Could not publish "${registryName}" — may need manual publish`);
        }
      }
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated, ${skipped} skipped, ${errors} error(s).`);

  if (errors > 0) {
    process.exit(1);
  }
}

main();
