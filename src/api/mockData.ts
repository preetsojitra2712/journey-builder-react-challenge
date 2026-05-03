import { ActionBlueprintGraph } from '../types/journey';

/**
 * Mock data representing the action blueprint graph.
 * This simulates the response from the backend server API.
 * In production, this would be fetched from: http://localhost:3001/api/v1/{tenant}/actions/blueprints/{id}/graph
 * 
 * The structure matches the actual API response from:
 * https://github.com/mosaic-avantos/frontendchallengeserver
 */
export const mockActionBlueprintGraph: ActionBlueprintGraph = {
  id: 'bp_01jk766tckfwx84xjcxazggzyc',
  tenant_id: '1',
  name: 'Onboard Customer',
  description: 'Customer onboarding workflow',
  category: 'Onboarding',
  nodes: [
    {
      id: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
      type: 'form',
      position: { x: 494, y: 269 },
      data: {
        id: 'bp_c_01jka1e3k0ewha8jbgeayz4cwp',
        component_key: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
        component_type: 'form',
        component_id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
        name: 'Form A',
        prerequisites: [],
        input_mapping: {},
      },
    },
    {
      id: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
      type: 'form',
      position: { x: 780, y: 155 },
      data: {
        id: 'bp_c_01jka1e3k2ewha2z3p674dbyrx',
        component_key: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
        component_type: 'form',
        component_id: 'f_01jk7awbhqewgbkbgk8rjm7bv7',
        name: 'Form B',
        prerequisites: ['form-47c61d17-62b0-4c42-8ca2-0eff641c9d88'],
        input_mapping: {},
      },
    },
    {
      id: 'form-7c26f280-7bff-40e3-b9a5-0533136f52c3',
      type: 'form',
      position: { x: 779, y: 362 },
      data: {
        id: 'bp_c_01jka1e3k1ewhbfr03fcxg8qze',
        component_key: 'form-7c26f280-7bff-40e3-b9a5-0533136f52c3',
        component_type: 'form',
        component_id: 'f_01jk7aygnqewh8gt8549beb1yc',
        name: 'Form C',
        prerequisites: ['form-47c61d17-62b0-4c42-8ca2-0eff641c9d88'],
        input_mapping: {},
      },
    },
    {
      id: 'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
      type: 'form',
      position: { x: 1093, y: 155 },
      data: {
        id: 'bp_c_01jka1e3jzewhb9eqfq08rk90b',
        component_key: 'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
        component_type: 'form',
        component_id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
        name: 'Form D',
        prerequisites: ['form-a4750667-d774-40fb-9b0a-44f8539ff6c4'],
        input_mapping: {},
      },
    },
    {
      id: 'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
      type: 'form',
      position: { x: 1100, y: 362 },
      data: {
        id: 'bp_c_01jka1e3k3ewhbpfxt533q5hcw',
        component_key: 'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
        component_type: 'form',
        component_id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
        name: 'Form E',
        prerequisites: ['form-7c26f280-7bff-40e3-b9a5-0533136f52c3'],
        input_mapping: {},
      },
    },
    {
      id: 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
      type: 'form',
      position: { x: 1437, y: 264 },
      data: {
        id: 'bp_c_01jka1e3jwewhb2177h7901c5j',
        component_key: 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
        component_type: 'form',
        component_id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
        name: 'Form F',
        prerequisites: [
          'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
          'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
        ],
        input_mapping: {},
      },
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
      target: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
    },
    {
      id: 'edge-2',
      source: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
      target: 'form-7c26f280-7bff-40e3-b9a5-0533136f52c3',
    },
    {
      id: 'edge-3',
      source: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
      target: 'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
    },
    {
      id: 'edge-4',
      source: 'form-7c26f280-7bff-40e3-b9a5-0533136f52c3',
      target: 'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
    },
    {
      id: 'edge-5',
      source: 'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
      target: 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    },
    {
      id: 'edge-6',
      source: 'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
      target: 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    },
  ],
  // Forms array (matches actual API structure)
  forms: [
    {
      id: 'f_01jk7ap2r3ewf9gx6a9r09gzjv',
      name: 'test form',
      description: 'test',
      field_schema: {
        type: 'object',
        properties: {
          dynamic_checkbox_group: {
            avantos_type: 'checkbox-group',
            type: 'array',
            title: 'Dynamic Checkbox Group',
          },
          dynamic_object: {
            avantos_type: 'object-enum',
            type: 'object',
            title: 'Dynamic Object',
          },
          email: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Email',
          },
          id: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'ID',
          },
          name: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Name',
          },
          notes: {
            avantos_type: 'multi-line-text',
            type: 'string',
            title: 'Notes',
          },
          multi_select: {
            avantos_type: 'multi-select',
            type: 'array',
            title: 'Multi Select',
          },
        },
        required: ['id', 'name', 'email'],
      },
    },
    {
      id: 'f_01jk7awbhqewgbkbgk8rjm7bv7',
      name: 'test form',
      description: 'test',
      field_schema: {
        type: 'object',
        properties: {
          dynamic_checkbox_group: {
            avantos_type: 'checkbox-group',
            type: 'array',
            title: 'Dynamic Checkbox Group',
          },
          dynamic_object: {
            avantos_type: 'object-enum',
            type: 'object',
            title: 'Dynamic Object',
          },
          email: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Email',
          },
          id: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'ID',
          },
          name: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Name',
          },
          notes: {
            avantos_type: 'multi-line-text',
            type: 'string',
            title: 'Notes',
          },
          multi_select: {
            avantos_type: 'multi-select',
            type: 'array',
            title: 'Multi Select',
          },
        },
        required: ['id', 'name', 'email'],
      },
    },
    {
      id: 'f_01jk7aygnqewh8gt8549beb1yc',
      name: 'test form',
      description: 'test',
      field_schema: {
        type: 'object',
        properties: {
          dynamic_checkbox_group: {
            avantos_type: 'checkbox-group',
            type: 'array',
            title: 'Dynamic Checkbox Group',
          },
          dynamic_object: {
            avantos_type: 'object-enum',
            type: 'object',
            title: 'Dynamic Object',
          },
          email: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Email',
          },
          id: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'ID',
          },
          name: {
            avantos_type: 'short-text',
            type: 'string',
            title: 'Name',
          },
          notes: {
            avantos_type: 'multi-line-text',
            type: 'string',
            title: 'Notes',
          },
          multi_select: {
            avantos_type: 'multi-select',
            type: 'array',
            title: 'Multi Select',
          },
        },
        required: ['id', 'name', 'email'],
      },
    },
  ],
};
