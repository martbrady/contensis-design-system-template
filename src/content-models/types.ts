export type ContensisFieldType =
  | 'Short text'
  | 'Long text'
  | 'Canvas'
  | 'Entry'
  | 'Resource picker'
  | 'Tags'
  | 'Audience'
  | 'Asset'
  | 'Image'
  | 'Multiple image'
  | 'Rich text'
  | 'Markdown'
  | 'Number'
  | 'Decimal'
  | 'Yes/No'
  | 'Email address'
  | 'Phone number'
  | 'Website'
  | 'Dropdown'
  | 'Single choice'
  | 'Multiple choice'
  | 'Searchable dropdown'
  | 'Taxonomy'
  | 'Location'
  | 'Date'
  | 'Date and time';

export interface ContensisField {
  name: string;
  contensisType: ContensisFieldType;
  required: boolean;
  description: string;
  notes?: string;
  /** When this field links to another component's content model */
  componentRef?: string;
  /** Explicit array flag — preferred over description heuristic */
  isArray?: boolean;
  /** Custom required validation message (fallback: "A value is required.") */
  requiredMessage?: string;
  /** Allowed values for Dropdown / Single choice / Multiple choice fields */
  allowedValues?: string[];
  /** Default value for Dropdown fields */
  defaultValue?: string;
  /** Restrict an Entry field to specific content type IDs (e.g. ['person']) */
  allowedContentTypes?: string[];
}

export interface ContensisContentModelSpec {
  fields: ContensisField[];
  variants?: Record<string, ContensisField[]>;
  /** Override derived isChild (default: true if referenced by another component) */
  isChild?: boolean;
  /** Override derived hasChildren (default: true if has componentRef fields) */
  hasChildren?: boolean;
  /** Override (default: mirrors hasChildren) */
  canAddChildComponents?: boolean;
  /** Override (default: mirrors isChild) */
  canBeAddedAsChildComponent?: boolean;
}
