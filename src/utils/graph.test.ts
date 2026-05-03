import { describe, it, expect } from 'vitest';
import {
  getFormNodes,
  createFormsMap,
  getFormById,
  getDirectDependencies,
  getTransitiveDependencies,
} from './graph';
import { ActionBlueprintGraph } from '../types/journey';

/**
 * Mock graph data for testing.
 * Structure matches the actual API response from frontendchallengeserver.
 * 
 * Graph structure:
 *   Form A (no deps)
 *     ├── Form B (depends on A)
 *     │     └── Form C (depends on B)
 *     │           └── Form D (depends on A and C)
 *     └── Form D (depends on A and C)
 */
const createMockGraph = (): ActionBlueprintGraph => ({
  id: 'test-graph',
  tenant_id: 'tenant-1',
  name: 'Test Graph',
  nodes: [
    {
      id: 'node-a',
      type: 'form',
      data: {
        id: 'bp_a',
        component_id: 'form-def-1',
        component_type: 'form',
        component_key: 'node-a',
        name: 'Form A',
        prerequisites: [],
      },
    },
    {
      id: 'node-b',
      type: 'form',
      data: {
        id: 'bp_b',
        component_id: 'form-def-1',
        component_type: 'form',
        component_key: 'node-b',
        name: 'Form B',
        prerequisites: ['node-a'],
      },
    },
    {
      id: 'node-c',
      type: 'form',
      data: {
        id: 'bp_c',
        component_id: 'form-def-1',
        component_type: 'form',
        component_key: 'node-c',
        name: 'Form C',
        prerequisites: ['node-b'],
      },
    },
    {
      id: 'node-d',
      type: 'form',
      data: {
        id: 'bp_d',
        component_id: 'form-def-1',
        component_type: 'form',
        component_key: 'node-d',
        name: 'Form D',
        prerequisites: ['node-a', 'node-c'],
      },
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-a', target: 'node-b' },
    { id: 'edge-2', source: 'node-b', target: 'node-c' },
    { id: 'edge-3', source: 'node-a', target: 'node-d' },
    { id: 'edge-4', source: 'node-c', target: 'node-d' },
  ],
  // Forms as array (matches actual API)
  forms: [
    {
      id: 'form-def-1',
      name: 'test form',
      field_schema: {
        type: 'object',
        properties: {
          email: { type: 'string', title: 'Email' },
          name: { type: 'string', title: 'Name' },
        },
      },
    },
  ],
});

describe('getFormNodes', () => {
  it('should extract all form nodes from the graph', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);

    expect(formNodes).toHaveLength(4);
    // IDs are now node IDs
    expect(formNodes.map(f => f.id)).toEqual(['node-a', 'node-b', 'node-c', 'node-d']);
  });

  it('should extract fields from form schema', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formA = formNodes.find(f => f.id === 'node-a');

    expect(formA?.fields).toHaveLength(2);
    expect(formA?.fields.map(f => f.key)).toContain('email');
    expect(formA?.fields.map(f => f.key)).toContain('name');
  });

  it('should use node.data.name for display name', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    
    expect(formNodes.find(f => f.id === 'node-a')?.name).toBe('Form A');
    expect(formNodes.find(f => f.id === 'node-b')?.name).toBe('Form B');
  });
});

describe('createFormsMap', () => {
  it('should create a map indexed by form ID', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    expect(formsMap.size).toBe(4);
    expect(formsMap.get('node-a')?.name).toBe('Form A');
    expect(formsMap.get('node-b')?.name).toBe('Form B');
  });
});

describe('getFormById', () => {
  it('should return the form with matching ID', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const form = getFormById(formsMap, 'node-b');
    expect(form?.name).toBe('Form B');
  });

  it('should return undefined for non-existent ID', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const form = getFormById(formsMap, 'non-existent');
    expect(form).toBeUndefined();
  });
});

describe('getDirectDependencies', () => {
  it('should return direct upstream dependencies', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // Form B depends directly on Form A
    const depsB = getDirectDependencies(graph, 'node-b', formsMap);
    expect(depsB).toHaveLength(1);
    expect(depsB[0].id).toBe('node-a');

    // Form D depends directly on Form A and Form C
    const depsD = getDirectDependencies(graph, 'node-d', formsMap);
    expect(depsD).toHaveLength(2);
    expect(depsD.map(d => d.id)).toContain('node-a');
    expect(depsD.map(d => d.id)).toContain('node-c');
  });

  it('should return empty array for form with no dependencies', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const deps = getDirectDependencies(graph, 'node-a', formsMap);
    expect(deps).toHaveLength(0);
  });
});

describe('getTransitiveDependencies', () => {
  it('should return transitive dependencies excluding direct ones', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // Form C depends on B (direct) and A (transitive)
    const depsC = getTransitiveDependencies(graph, 'node-c', formsMap);
    expect(depsC).toHaveLength(1);
    expect(depsC[0].id).toBe('node-a');

    // Form D depends on A, C (direct) and B (transitive through C)
    const depsD = getTransitiveDependencies(graph, 'node-d', formsMap);
    expect(depsD).toHaveLength(1);
    expect(depsD[0].id).toBe('node-b');
  });

  it('should return empty array when no transitive dependencies exist', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // Form B only has direct dependency on A, no transitive
    const deps = getTransitiveDependencies(graph, 'node-b', formsMap);
    expect(deps).toHaveLength(0);
  });

  it('should handle forms with no dependencies', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const deps = getTransitiveDependencies(graph, 'node-a', formsMap);
    expect(deps).toHaveLength(0);
  });

  it('should not include duplicates', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const depsD = getTransitiveDependencies(graph, 'node-d', formsMap);
    const uniqueIds = new Set(depsD.map(d => d.id));
    expect(uniqueIds.size).toBe(depsD.length);
  });
});

describe('cycle safety', () => {
  it('should handle graphs without cycles gracefully', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // This should not throw or hang
    const deps = getTransitiveDependencies(graph, 'node-d', formsMap);
    expect(deps).toBeDefined();
  });
});
