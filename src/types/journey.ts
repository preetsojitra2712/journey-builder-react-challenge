/**
 * Core types for the Journey Builder application.
 * These types represent the API response structure and internal data models.
 */

// API Response Types
export interface ActionBlueprintGraph {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  category?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  // Forms can be either an array (actual API) or a Record (for convenience)
  forms?: FormDefinition[] | Record<string, FormDefinition>;
}

export interface GraphNode {
  id: string;
  type: string;
  data: NodeData;
  position?: { x: number; y: number };
}

export interface NodeData {
  id: string;
  component_id?: string;
  component_key?: string;
  component_type?: string;
  name?: string;
  prerequisites?: string[];
  permitted_roles?: string[];
  input_mapping?: Record<string, InputMappingValue>;
}

export interface InputMappingValue {
  type: string;
  value: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  field_schema?: FieldSchema;
  ui_schema?: Record<string, unknown>;
}

export interface FieldSchema {
  type: string;
  properties?: Record<string, FieldProperty>;
  required?: string[];
}

export interface FieldProperty {
  type: string;
  title?: string;
  description?: string;
  avantos_type?: string;
  enum?: string[];
  items?: FieldProperty;
  properties?: Record<string, FieldProperty>;
}

// Internal Application Types
export interface FormNode {
  id: string;
  nodeId: string;
  name: string;
  componentKey: string;
  fields: FormField[];
  prerequisites: string[];
}

export interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
}

export interface PrefillMapping {
  targetFormId: string;
  targetFieldKey: string;
  sourceType: 'form' | 'global';
  sourceId: string;
  sourceLabel: string;
  sourceFieldKey: string;
  displayPath: string;
}

export type MappingState = Record<string, Record<string, PrefillMapping | null>>;

// Data Source Types
export interface PrefillContext {
  graph: ActionBlueprintGraph;
  selectedFormId: string;
  formsById: Map<string, FormNode>;
  directDependencies: FormNode[];
  transitiveDependencies: FormNode[];
}

export interface PrefillOption {
  id: string;
  label: string;
  sourceLabel: string;
  sourceType: 'form' | 'global';
  sourceId: string;
  fieldKey: string;
  displayPath: string;
  metadata?: Record<string, unknown>;
}

export interface PrefillDataSource {
  id: string;
  label: string;
  getItems: (context: PrefillContext) => PrefillOption[];
}
