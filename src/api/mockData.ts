import { ActionBlueprintGraph } from '../types/journey';

/**
 * Mock data representing the action blueprint graph.
 * This simulates the response from the backend server API.
 * In production, this would be fetched from: http://localhost:3001/api/v1/actions/:id/blueprints/graph
 */
export const mockActionBlueprintGraph: ActionBlueprintGraph = {
  id: 'action-blueprint-1',
  tenant_id: 'tenant-001',
  name: 'Customer Onboarding Journey',
  description: 'A multi-step customer onboarding workflow',
  category: 'onboarding',
  nodes: [
    {
      id: 'node-form-a',
      type: 'form',
      data: {
        id: 'form-a',
        component_id: 'form-a',
        component_type: 'form',
        component_key: 'personal_info',
        name: 'Personal Information',
        prerequisites: [],
        input_mapping: {},
      },
      position: { x: 100, y: 100 },
    },
    {
      id: 'node-form-b',
      type: 'form',
      data: {
        id: 'form-b',
        component_id: 'form-b',
        component_type: 'form',
        component_key: 'contact_details',
        name: 'Contact Details',
        prerequisites: ['form-a'],
        input_mapping: {
          email: { type: 'prefill', value: 'form-a.email' },
        },
      },
      position: { x: 300, y: 100 },
    },
    {
      id: 'node-form-c',
      type: 'form',
      data: {
        id: 'form-c',
        component_id: 'form-c',
        component_type: 'form',
        component_key: 'address_info',
        name: 'Address Information',
        prerequisites: ['form-b'],
        input_mapping: {},
      },
      position: { x: 500, y: 100 },
    },
    {
      id: 'node-form-d',
      type: 'form',
      data: {
        id: 'form-d',
        component_id: 'form-d',
        component_type: 'form',
        component_key: 'verification',
        name: 'Verification',
        prerequisites: ['form-a', 'form-c'],
        input_mapping: {},
      },
      position: { x: 700, y: 100 },
    },
    {
      id: 'node-form-e',
      type: 'form',
      data: {
        id: 'form-e',
        component_id: 'form-e',
        component_type: 'form',
        component_key: 'preferences',
        name: 'Preferences',
        prerequisites: ['form-b'],
        input_mapping: {},
      },
      position: { x: 500, y: 250 },
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-form-a', target: 'node-form-b' },
    { id: 'edge-2', source: 'node-form-b', target: 'node-form-c' },
    { id: 'edge-3', source: 'node-form-a', target: 'node-form-d' },
    { id: 'edge-4', source: 'node-form-c', target: 'node-form-d' },
    { id: 'edge-5', source: 'node-form-b', target: 'node-form-e' },
  ],
  forms: {
    'form-a': {
      id: 'form-a',
      name: 'Personal Information',
      description: 'Collect basic personal information',
      field_schema: {
        type: 'object',
        properties: {
          first_name: { type: 'string', title: 'First Name', avantos_type: 'short_text' },
          last_name: { type: 'string', title: 'Last Name', avantos_type: 'short_text' },
          email: { type: 'string', title: 'Email Address', avantos_type: 'email' },
          date_of_birth: { type: 'string', title: 'Date of Birth', avantos_type: 'date' },
        },
        required: ['first_name', 'last_name', 'email'],
      },
    },
    'form-b': {
      id: 'form-b',
      name: 'Contact Details',
      description: 'Collect contact information',
      field_schema: {
        type: 'object',
        properties: {
          email: { type: 'string', title: 'Email', avantos_type: 'email' },
          phone: { type: 'string', title: 'Phone Number', avantos_type: 'phone' },
          preferred_contact: {
            type: 'string',
            title: 'Preferred Contact Method',
            avantos_type: 'select',
            enum: ['email', 'phone', 'sms'],
          },
        },
        required: ['email', 'phone'],
      },
    },
    'form-c': {
      id: 'form-c',
      name: 'Address Information',
      description: 'Collect address details',
      field_schema: {
        type: 'object',
        properties: {
          street_address: { type: 'string', title: 'Street Address', avantos_type: 'long_text' },
          city: { type: 'string', title: 'City', avantos_type: 'short_text' },
          state: { type: 'string', title: 'State', avantos_type: 'short_text' },
          zip_code: { type: 'string', title: 'ZIP Code', avantos_type: 'short_text' },
          country: { type: 'string', title: 'Country', avantos_type: 'select' },
        },
        required: ['street_address', 'city', 'zip_code'],
      },
    },
    'form-d': {
      id: 'form-d',
      name: 'Verification',
      description: 'Verify collected information',
      field_schema: {
        type: 'object',
        properties: {
          id_number: { type: 'string', title: 'ID Number', avantos_type: 'short_text' },
          id_type: {
            type: 'string',
            title: 'ID Type',
            avantos_type: 'select',
            enum: ['passport', 'drivers_license', 'national_id'],
          },
          verified: { type: 'boolean', title: 'Verified', avantos_type: 'checkbox' },
          verification_date: { type: 'string', title: 'Verification Date', avantos_type: 'date' },
          notes: { type: 'string', title: 'Notes', avantos_type: 'long_text' },
        },
        required: ['id_number', 'id_type'],
      },
    },
    'form-e': {
      id: 'form-e',
      name: 'Preferences',
      description: 'Collect user preferences',
      field_schema: {
        type: 'object',
        properties: {
          newsletter: { type: 'boolean', title: 'Subscribe to Newsletter', avantos_type: 'checkbox' },
          notifications: { type: 'boolean', title: 'Enable Notifications', avantos_type: 'checkbox' },
          language: {
            type: 'string',
            title: 'Preferred Language',
            avantos_type: 'select',
            enum: ['en', 'es', 'fr', 'de'],
          },
          timezone: { type: 'string', title: 'Timezone', avantos_type: 'select' },
        },
        required: [],
      },
    },
  },
};
