import { ActionBlueprintGraph } from '../types/journey';
import { mockActionBlueprintGraph } from './mockData';

/**
 * API base URL for the backend server.
 * The backend server should be running at http://localhost:3001
 * Clone and run: https://github.com/mosaic-avantos/frontendchallengeserver
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Whether to use mock data instead of the real API.
 * Set VITE_USE_MOCK=true in .env to use mock data.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Fetches the action blueprint graph from the API or returns mock data.
 * The graph contains form nodes, edges representing dependencies,
 * and form definitions with field schemas.
 * 
 * Falls back to mock data if the API is unavailable.
 */
export async function fetchActionBlueprintGraph(): Promise<ActionBlueprintGraph> {
  // Use mock data if configured or if API is unavailable
  if (USE_MOCK) {
    // Simulate network delay for realistic behavior
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockActionBlueprintGraph;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/actions/1/blueprints/graph`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status}, falling back to mock data`);
      return mockActionBlueprintGraph;
    }
    
    const data = await response.json();
    return data as ActionBlueprintGraph;
  } catch (error) {
    console.warn('Failed to fetch from API, using mock data:', error);
    return mockActionBlueprintGraph;
  }
}
