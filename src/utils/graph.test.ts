import { describe, it, expect } from 'vitest';
import {
  getFormNodes,
  createFormsMap,
  getFormById,
  getDirectDependencies,
  getTransitiveDependencies,
} from './graph';
import { ActionBlueprintGraph } from '../types/journey';

// Mock graph data for testing
const createMockGraph = (): ActionBlueprintGraph => ({
  id: 'test-graph',
  tenant_id: 'tenant-1',
  name: 'Test Graph',
  nodes: [
    {
      id: 'node-a',
      type: 'form',
      data: {
        id: 'form-a',
        component_id: 'form-a',
        component_type: 'form',
        component_key: 'form_a',
        name: 'Form A',
        prerequisites: [],
      },
    },
    {
      id: 'node-b',
      type: 'form',
      data: {
        id: 'form-b',
        component_id: 'form-b',
        component_type: 'form',
        component_key: 'form_b',
        name: 'Form B',
        prerequisites: ['form-a'],
      },
    },
    {
      id: 'node-c',
      type: 'form',
      data: {
        id: 'form-c',
        component_id: 'form-c',
        component_type: 'form',
        component_key: 'form_c',
        name: 'Form C',
        prerequisites: ['form-b'],
      },
    },
    {
      id: 'node-d',
      type: 'form',
      data: {
        id: 'form-d',
        component_id: 'form-d',
        component_type: 'form',
        component_key: 'form_d',
        name: 'Form D',
        prerequisites: ['form-a', 'form-c'],
      },
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-a', target: 'node-b' },
    { id: 'edge-2', source: 'node-b', target: 'node-c' },
    { id: 'edge-3', source: 'node-a', target: 'node-d' },
    { id: 'edge-4', source: 'node-c', target: 'node-d' },
  ],
  forms: {
    'form-a': {
      id: 'form-a',
      name: 'Form A',
      field_schema: {
        type: 'object',
        properties: {
          email: { type: 'string', title: 'Email' },
          name: { type: 'string', title: 'Name' },
        },
      },
    },
    'form-b': {
      id: 'form-b',
      name: 'Form B',
      field_schema: {
        type: 'object',
        properties: {
          phone: { type: 'string', title: 'Phone' },
        },
      },
    },
    'form-c': {
      id: 'form-c',
      name: 'Form C',
      field_schema: {
        type: 'object',
        properties: {
          address: { type: 'string', title: 'Address' },
        },
      },
    },
    'form-d': {
      id: 'form-d',
      name: 'Form D',
      field_schema: {
        type: 'object',
        properties: {
          notes: { type: 'string', title: 'Notes' },
        },
      },
    },
  },
});

describe('getFormNodes', () => {
  it('should extract all form nodes from the graph', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);

    expect(formNodes).toHaveLength(4);
    expect(formNodes.map(f => f.id)).toEqual(['form-a', 'form-b', 'form-c', 'form-d']);
  });

  it('should extract fields from form schema', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formA = formNodes.find(f => f.id === 'form-a');

    expect(formA?.fields).toHaveLength(2);
    expect(formA?.fields.map(f => f.key)).toContain('email');
    expect(formA?.fields.map(f => f.key)).toContain('name');
  });
});

describe('createFormsMap', () => {
  it('should create a map indexed by form ID', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    expect(formsMap.size).toBe(4);
    expect(formsMap.get('form-a')?.name).toBe('Form A');
    expect(formsMap.get('form-b')?.name).toBe('Form B');
  });
});

describe('getFormById', () => {
  it('should return the form with matching ID', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const form = getFormById(formsMap, 'form-b');
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
    const depsB = getDirectDependencies(graph, 'form-b', formsMap);
    expect(depsB).toHaveLength(1);
    expect(depsB[0].id).toBe('form-a');

    // Form D depends directly on Form A and Form C
    const depsD = getDirectDependencies(graph, 'form-d', formsMap);
    expect(depsD).toHaveLength(2);
    expect(depsD.map(d => d.id)).toContain('form-a');
    expect(depsD.map(d => d.id)).toContain('form-c');
  });

  it('should return empty array for form with no dependencies', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const deps = getDirectDependencies(graph, 'form-a', formsMap);
    expect(deps).toHaveLength(0);
  });
});

describe('getTransitiveDependencies', () => {
  it('should return transitive dependencies excluding direct ones', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // Form C depends on B (direct) and A (transitive)
    const depsC = getTransitiveDependencies(graph, 'form-c', formsMap);
    expect(depsC).toHaveLength(1);
    expect(depsC[0].id).toBe('form-a');

    // Form D depends on A, C (direct) and B (transitive through C)
    const depsD = getTransitiveDependencies(graph, 'form-d', formsMap);
    expect(depsD).toHaveLength(1);
    expect(depsD[0].id).toBe('form-b');
  });

  it('should return empty array when no transitive dependencies exist', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    // Form B only has direct dependency on A, no transitive
    const deps = getTransitiveDependencies(graph, 'form-b', formsMap);
    expect(deps).toHaveLength(0);
  });

  it('should handle forms with no dependencies', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const deps = getTransitiveDependencies(graph, 'form-a', formsMap);
    expect(deps).toHaveLength(0);
  });

  it('should not include duplicates', () => {
    const graph = createMockGraph();
    const formNodes = getFormNodes(graph);
    const formsMap = createFormsMap(formNodes);

    const depsD = getTransitiveDependencies(graph, 'form-d', formsMap);
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
    const deps = getTransitiveDependencies(graph, 'form-d', formsMap);
    expect(deps).toBeDefined();
  });
});
