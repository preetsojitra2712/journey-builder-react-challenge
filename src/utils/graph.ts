import {
  ActionBlueprintGraph,
  FormNode,
  FormField,
  FieldProperty,
  FormDefinition,
} from '../types/journey';

/**
 * Normalizes forms from the API response.
 * The API returns forms as an array, but we convert to a Map for efficient lookup.
 */
function normalizeFormsToMap(
  forms: FormDefinition[] | Record<string, FormDefinition> | undefined
): Map<string, FormDefinition> {
  const map = new Map<string, FormDefinition>();
  
  if (!forms) return map;
  
  if (Array.isArray(forms)) {
    // API returns forms as an array
    for (const form of forms) {
      map.set(form.id, form);
    }
  } else {
    // Forms as a Record (for backwards compatibility)
    for (const [id, form] of Object.entries(forms)) {
      map.set(id, form);
    }
  }
  
  return map;
}

/**
 * Extracts all form nodes from the graph.
 * Form nodes are identified by having a component_type of 'form'.
 * Each node references a form definition via component_id.
 */
export function getFormNodes(graph: ActionBlueprintGraph): FormNode[] {
  const formNodes: FormNode[] = [];
  const formsMap = normalizeFormsToMap(graph.forms);
  
  for (const node of graph.nodes) {
    if (node.data.component_type === 'form' || node.type === 'form') {
      // Look up form definition by component_id
      const formDef = formsMap.get(node.data.component_id ?? '');
      const fields = extractFieldsFromSchema(formDef?.field_schema);
      
      formNodes.push({
        // Use nodeId as the unique identifier (since multiple nodes can share same component_id)
        id: node.id,
        nodeId: node.id,
        // Use node.data.name for display (e.g., "Form A", "Form B")
        name: node.data.name ?? formDef?.name ?? node.data.component_key ?? 'Unnamed Form',
        componentKey: node.data.component_key ?? '',
        fields,
        prerequisites: node.data.prerequisites ?? [],
      });
    }
  }
  
  return formNodes;
}

/**
 * Creates a map of form nodes indexed by their component ID.
 */
export function createFormsMap(formNodes: FormNode[]): Map<string, FormNode> {
  const map = new Map<string, FormNode>();
  for (const form of formNodes) {
    map.set(form.id, form);
  }
  return map;
}

/**
 * Gets a form node by its ID.
 */
export function getFormById(
  formsMap: Map<string, FormNode>,
  formId: string
): FormNode | undefined {
  return formsMap.get(formId);
}

/**
 * Gets direct dependencies (upstream forms) for a given form.
 * Direct dependencies are forms that the selected form directly depends on,
 * determined by traversing edges in reverse (target -> source).
 */
export function getDirectDependencies(
  graph: ActionBlueprintGraph,
  formId: string,
  formsMap: Map<string, FormNode>
): FormNode[] {
  const directDeps: FormNode[] = [];
  const targetNodeId = findNodeIdByFormId(graph, formId);
  
  if (!targetNodeId) return directDeps;
  
  // Find all edges where this form is the target (depends on source)
  for (const edge of graph.edges) {
    if (edge.target === targetNodeId) {
      const sourceForm = findFormByNodeId(graph, edge.source, formsMap);
      if (sourceForm) {
        directDeps.push(sourceForm);
      }
    }
  }
  
  return directDeps;
}

/**
 * Gets transitive dependencies (all upstream forms) for a given form.
 * This performs a breadth-first traversal of the DAG to find all forms
 * that the selected form transitively depends on, excluding direct dependencies.
 */
export function getTransitiveDependencies(
  graph: ActionBlueprintGraph,
  formId: string,
  formsMap: Map<string, FormNode>
): FormNode[] {
  const directDeps = getDirectDependencies(graph, formId, formsMap);
  const directDepIds = new Set(directDeps.map(f => f.id));
  const visited = new Set<string>([formId, ...directDepIds]);
  const transitiveDeps: FormNode[] = [];
  
  // BFS starting from direct dependencies
  const queue = [...directDeps];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNodeId = findNodeIdByFormId(graph, current.id);
    
    if (!currentNodeId) continue;
    
    // Find upstream forms of current form
    for (const edge of graph.edges) {
      if (edge.target === currentNodeId) {
        const sourceForm = findFormByNodeId(graph, edge.source, formsMap);
        if (sourceForm && !visited.has(sourceForm.id)) {
          visited.add(sourceForm.id);
          transitiveDeps.push(sourceForm);
          queue.push(sourceForm);
        }
      }
    }
  }
  
  return transitiveDeps;
}

/**
 * Finds the graph node ID for a given form ID.
 * Since we use node.id as the form identifier, this is a direct lookup.
 */
function findNodeIdByFormId(_graph: ActionBlueprintGraph, formId: string): string {
  // formId is already the node.id
  return formId;
}

/**
 * Finds a form by its graph node ID.
 */
function findFormByNodeId(
  _graph: ActionBlueprintGraph,
  nodeId: string,
  formsMap: Map<string, FormNode>
): FormNode | undefined {
  // Since we use node.id as the form.id, direct lookup works
  return formsMap.get(nodeId);
}

/**
 * Extracts form fields from a JSON schema definition.
 */
function extractFieldsFromSchema(schema?: { properties?: Record<string, FieldProperty>; required?: string[] }): FormField[] {
  if (!schema?.properties) return [];
  
  const fields: FormField[] = [];
  const requiredFields = new Set(schema.required ?? []);
  
  for (const [key, prop] of Object.entries(schema.properties)) {
    fields.push({
      key,
      label: prop.title ?? formatFieldLabel(key),
      type: prop.avantos_type ?? prop.type ?? 'string',
      required: requiredFields.has(key),
    });
  }
  
  return fields;
}

/**
 * Formats a field key into a human-readable label.
 */
function formatFieldLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}
