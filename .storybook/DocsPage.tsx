import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
  useOf,
} from '@storybook/addon-docs/blocks';
import { ContensisDocsBlock } from './ContensisDocsBlock';
import { contentModelRegistry } from '../src/content-models/registry';

/* Load all generated Contensis JSON models via Vite glob import */
const contensisModels = import.meta.glob(
  '../src/components/**/*.contensis.json',
  { eager: true, import: 'default' },
) as Record<string, Record<string, unknown>>;

/** Build a lookup: component name → JSON model */
function findContensisJson(componentName: string): Record<string, unknown> | undefined {
  for (const [filePath, model] of Object.entries(contensisModels)) {
    // filePath looks like "../src/components/Button/Button.contensis.json"
    const segments = filePath.split('/');
    // The directory name is the second-to-last segment
    const dirName = segments[segments.length - 2];
    if (!dirName) continue;

    // Match directory name against component name (case-insensitive, space-insensitive)
    const normalisedDir = dirName.toLowerCase().replace(/\s+/g, '');
    const normalisedName = componentName.toLowerCase().replace(/\s+/g, '');
    if (normalisedDir === normalisedName) {
      return model;
    }
  }
  return undefined;
}

function extractComponentName(title: string): string {
  const parts = title.trim().split(/\s*\/\s*/);
  return parts[parts.length - 1] || title;
}

export function DocsPage() {
  const resolvedOf = useOf('meta', ['meta']);
  const { stories } = resolvedOf.csfFile;
  const isSingleStory = Object.keys(stories).length === 1;

  const metaTitle = resolvedOf.preparedMeta?.title || '';
  const componentName = extractComponentName(metaTitle);
  const contentModel = contentModelRegistry[componentName];
  const contensisJson = findContensisJson(componentName);

  return (
    <>
      <Title />
      <Subtitle />
      <Description of="meta" />
      {isSingleStory ? <Description of="story" /> : null}
      <Primary />
      <Controls />
      {isSingleStory ? null : <Stories />}
      <ContensisDocsBlock
        componentName={componentName}
        spec={contentModel}
        contensisJson={contensisJson}
      />
    </>
  );
}
