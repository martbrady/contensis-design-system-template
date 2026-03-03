/**
 * Contensis Component Model Generator
 *
 * Converts registry entries into Contensis Management API-compatible
 * component model JSON (for POST /api/management/projects/{projectId}/components/).
 *
 * Generated JSON is create-safe: no version, uuid, or timestamp metadata.
 */

import type { ContensisContentModelSpec, ContensisField } from './types';

/* ============================================
   Validation patterns (central constants)
   Sourced from canonical Contensis field examples.
   ============================================ */

export const VALIDATIONS = {
  EMAIL_REGEX: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    message: { 'en-GB': 'Please enter a valid email address.' },
  },
  PHONE_REGEX: {
    pattern: '^[0-9+()\\s-]+$',
    message: { 'en-GB': 'Please enter a valid phone number.' },
  },
} as const;

const DEFAULT_REQUIRED_MESSAGE = 'A value is required.';

/* ============================================
   Helpers
   ============================================ */

/** Convert "Canvas Card Block" → "canvasCardBlock", "CTA Banner" → "ctaBanner" */
export function toCamelCase(name: string): string {
  const words = name.split(/[\s]+/);
  return words
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

/** Convert "chatText" → "Chat text" */
export function toHumanLabel(fieldId: string): string {
  const spaced = fieldId.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/* ============================================
   Field type mapping
   ============================================ */

interface FieldTypeMapping {
  dataType: string;
  dataFormat: string | null;
  editor: null | { id: string; instructions: { 'en-GB': string }; label: Record<string, never>; properties: null };
}

function mapFieldType(
  field: ContensisField,
  _fullRegistry: Record<string, ContensisContentModelSpec>,
): FieldTypeMapping {
  const isArray = resolveIsArray(field);
  const type = field.contensisType;

  switch (type) {
    case 'Short text':
      return {
        dataType: isArray ? 'stringArray' : 'string',
        dataFormat: null,
        editor: null,
      };

    case 'Long text':
      return {
        dataType: 'string',
        dataFormat: null,
        editor: {
          id: 'multiline',
          instructions: { 'en-GB': '' },
          label: {},
          properties: null,
        },
      };

    case 'Rich text':
      return {
        dataType: 'string',
        dataFormat: 'html',
        editor: null,
      };

    case 'Canvas':
      return {
        dataType: 'objectArray',
        dataFormat: 'canvas',
        editor: null,
      };

    case 'Markdown':
      return {
        dataType: 'string',
        dataFormat: null,
        editor: null,
      };

    case 'Image':
      return {
        dataType: 'object',
        dataFormat: 'image',
        editor: null,
      };

    case 'Multiple image':
      return {
        dataType: 'objectArray',
        dataFormat: 'image',
        editor: null,
      };

    case 'Entry': {
      if (field.componentRef) {
        const refId = toCamelCase(field.componentRef);
        return {
          dataType: isArray ? 'objectArray' : 'object',
          dataFormat: `component.${refId}`,
          editor: null,
        };
      }
      return {
        dataType: isArray ? 'objectArray' : 'object',
        dataFormat: 'entry',
        editor: null,
      };
    }

    case 'Asset':
      return {
        dataType: 'object',
        dataFormat: 'asset',
        editor: null,
      };

    case 'Number':
      return {
        dataType: 'integer',
        dataFormat: null,
        editor: null,
      };

    case 'Decimal':
      return {
        dataType: 'decimal',
        dataFormat: null,
        editor: null,
      };

    case 'Yes/No':
      return {
        dataType: 'boolean',
        dataFormat: null,
        editor: null,
      };

    case 'Email address':
    case 'Phone number':
    case 'Website':
      return {
        dataType: 'string',
        dataFormat: null,
        editor: null,
      };

    case 'Date':
    case 'Date and time':
      return {
        dataType: 'dateTime',
        dataFormat: null,
        editor: null,
      };

    default:
      // Fallback for unmapped types
      return {
        dataType: 'string',
        dataFormat: null,
        editor: null,
      };
  }
}

/* ============================================
   Array detection
   ============================================ */

/** Warnings collected during generation */
export const warnings: string[] = [];

function resolveIsArray(field: ContensisField): boolean {
  // Priority 1: explicit flag
  if (field.isArray === true) return true;
  if (field.isArray === false) return false;

  // Priority 2: inherently array types
  if (field.contensisType === 'Multiple image') return true;
  if (field.contensisType === 'Canvas') return true;

  // Priority 3: heuristic fallback (with warning)
  if (field.description.includes('Array of')) {
    warnings.push(
      `Field "${field.name}": using "Array of" heuristic fallback. Consider adding isArray: true to the registry.`,
    );
    return true;
  }

  return false;
}

/* ============================================
   Validations
   ============================================ */

function buildValidations(field: ContensisField): Record<string, unknown> {
  const validations: Record<string, unknown> = {};

  if (field.required) {
    validations.required = {
      message: {
        'en-GB': field.requiredMessage || DEFAULT_REQUIRED_MESSAGE,
      },
    };
  }

  if (field.contensisType === 'Email address') {
    validations.regex = {
      pattern: VALIDATIONS.EMAIL_REGEX.pattern,
      message: { ...VALIDATIONS.EMAIL_REGEX.message },
    };
  }

  if (field.contensisType === 'Phone number') {
    validations.regex = {
      pattern: VALIDATIONS.PHONE_REGEX.pattern,
      message: { ...VALIDATIONS.PHONE_REGEX.message },
    };
  }

  if (field.allowedContentTypes && field.allowedContentTypes.length > 0) {
    validations.allowedContentTypes = {
      contentTypes: field.allowedContentTypes,
    };
  }

  if (field.allowedValues && field.allowedValues.length > 0) {
    validations.allowedValues = {
      values: field.allowedValues.map((v) => ({ 'en-GB': v })),
      labeledValues: field.allowedValues.map((v) => ({
        value: v,
        label: { 'en-GB': v.charAt(0).toUpperCase() + v.slice(1) },
      })),
      message: null,
    };
  }

  return validations;
}

/* ============================================
   Field conversion
   ============================================ */

function convertField(
  field: ContensisField,
  fullRegistry: Record<string, ContensisContentModelSpec>,
): Record<string, unknown> {
  const { dataType, dataFormat, editor } = mapFieldType(field, fullRegistry);
  const validations = buildValidations(field);

  return {
    id: field.name,
    name: { 'en-GB': toHumanLabel(field.name) },
    dataType,
    dataFormat,
    description: {},
    default: field.defaultValue ? { 'en-GB': field.defaultValue } : null,
    validations,
    editor,
  };
}

/* ============================================
   Component-level flag derivation
   ============================================ */

function deriveHasChildren(spec: ContensisContentModelSpec): boolean {
  if (spec.hasChildren !== undefined) return spec.hasChildren;
  return spec.fields.some((f) => f.componentRef !== undefined);
}

function deriveIsChild(
  componentName: string,
  fullRegistry: Record<string, ContensisContentModelSpec>,
  spec: ContensisContentModelSpec,
): boolean {
  if (spec.isChild !== undefined) return spec.isChild;
  return Object.values(fullRegistry).some((otherSpec) =>
    otherSpec.fields.some((f) => f.componentRef === componentName),
  );
}

/* ============================================
   Main converter
   ============================================ */

export function registryToContensisModel(
  componentName: string,
  spec: ContensisContentModelSpec,
  fullRegistry: Record<string, ContensisContentModelSpec>,
): Record<string, unknown> {
  const hasChildren = deriveHasChildren(spec);
  const isChild = deriveIsChild(componentName, fullRegistry, spec);

  const canAddChildComponents =
    spec.canAddChildComponents !== undefined ? spec.canAddChildComponents : hasChildren;
  const canBeAddedAsChildComponent =
    spec.canBeAddedAsChildComponent !== undefined ? spec.canBeAddedAsChildComponent : isChild;

  const fields = spec.fields.map((field) => convertField(field, fullRegistry));

  return {
    id: toCamelCase(componentName),
    projectId: '{{projectId}}',
    name: { 'en-GB': componentName },
    description: { 'en-GB': `Content model for the ${componentName} component.` },
    isChild,
    hasChildren,
    canAddChildComponents,
    canBeAddedAsChildComponent,
    fields,
    dataFormat: 'component',
    enabled: null,
    properties: null,
  };
}
