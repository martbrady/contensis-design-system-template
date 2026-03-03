/**
 * Generate Contensis component model JSON files from the registry.
 *
 * Usage: npx tsx scripts/generate-contensis-models.ts
 *
 * For each component in the registry, writes a <ComponentDir>.contensis.json
 * file inside the component's source directory.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentModelRegistry } from '../src/content-models/registry.ts';
import { registryToContensisModel, warnings } from '../src/content-models/contensisModelGenerator.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ============================================
   Directory-to-registry name mapping
   Add a new entry here whenever you add a component to the registry.
   ============================================ */

const REGISTRY_TO_DIR: Record<string, string> = {
  // e.g. Button: 'Button',
  // e.g. 'CTA Banner': 'CtaBanner',
};

/* ============================================
   Main
   ============================================ */

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');
let filesWritten = 0;
let errors = 0;

for (const [registryName, spec] of Object.entries(contentModelRegistry)) {
  const dirName = REGISTRY_TO_DIR[registryName];

  if (!dirName) {
    console.error(`ERROR: No directory mapping for registry key "${registryName}". Skipping.`);
    errors++;
    continue;
  }

  const componentDir = path.join(COMPONENTS_DIR, dirName);

  if (!fs.existsSync(componentDir)) {
    console.error(
      `ERROR: Component directory does not exist: ${componentDir}. Skipping "${registryName}".`,
    );
    errors++;
    continue;
  }

  // Clear warnings before each component
  warnings.length = 0;

  const model = registryToContensisModel(registryName, spec, contentModelRegistry);
  const outputPath = path.join(componentDir, `${dirName}.contensis.json`);
  const json = JSON.stringify(model, null, 2) + '\n';

  fs.writeFileSync(outputPath, json, 'utf-8');
  filesWritten++;

  const warningText = warnings.length > 0 ? ` (${warnings.length} warning(s))` : '';
  console.log(`  wrote ${path.relative(process.cwd(), outputPath)}${warningText}`);

  for (const w of warnings) {
    console.warn(`    WARN: ${w}`);
  }
}

console.log(`\nDone. ${filesWritten} file(s) written.`);

if (errors > 0) {
  console.error(`${errors} error(s) encountered.`);
  process.exit(1);
}
