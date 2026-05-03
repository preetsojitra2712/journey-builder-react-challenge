# Journey Builder - Prefill Mapping UI

A React + TypeScript application for configuring prefill mappings in a journey builder workflow. This application allows users to select forms from a directed acyclic graph (DAG) and configure how fields should be prefilled from upstream form data or global data sources.

## Features

- **Form Selection**: Browse and select forms from the journey graph
- **Prefill Configuration**: Configure prefill mappings for each form field
- **DAG Traversal**: Automatically resolves direct and transitive dependencies
- **Extensible Data Sources**: Plugin architecture for adding new data sources
- **Search & Filter**: Search through available data elements in the mapping modal

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/preetsojitra2712/journey-builder-react-challenge.git
cd journey-builder-react-challenge

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test
```

## Architecture

### Project Structure

```
src/
├── api/                    # API client for fetching graph data
│   └── journeyApi.ts
├── components/             # React UI components
│   ├── AppLayout.tsx       # Two-panel layout
│   ├── FormList.tsx        # Left panel form list
│   ├── FormListItem.tsx    # Individual form card
│   ├── PrefillPanel.tsx    # Right panel configuration
│   ├── FieldMappingRow.tsx # Field mapping display
│   ├── MappingModal.tsx    # Data element selection modal
│   ├── EmptyState.tsx      # Empty state placeholder
│   ├── LoadingState.tsx    # Loading indicator
│   └── ErrorState.tsx      # Error display
├── dataSources/            # Extensible data source system
│   ├── dataSourceRegistry.ts
│   ├── globalDataSource.ts
│   ├── formDependencyDataSource.ts
│   └── types.ts
├── hooks/                  # React hooks
│   ├── useJourneyGraph.ts  # Graph data fetching
│   └── usePrefillMappings.ts # Mapping state management
├── types/                  # TypeScript type definitions
│   └── journey.ts
├── utils/                  # Utility functions
│   ├── graph.ts            # DAG traversal utilities
│   └── graph.test.ts       # Graph utility tests
├── styles/                 # Global styles
│   └── global.css
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

### DAG Traversal

The application uses a directed acyclic graph (DAG) to represent form dependencies. When a form is selected, the system traverses the graph to find:

1. **Direct Dependencies**: Forms that the selected form directly depends on (immediate upstream nodes)
2. **Transitive Dependencies**: All forms reachable by traversing upstream from direct dependencies

The traversal algorithm:

```
1. Find the graph node corresponding to the selected form
2. For direct dependencies:
   - Find all edges where the selected form is the target
   - Return the source forms of those edges
3. For transitive dependencies:
   - Start BFS from direct dependencies
   - For each form, find its upstream forms
   - Track visited forms to avoid duplicates
   - Exclude direct dependencies from the result
```

Key functions in `src/utils/graph.ts`:
- `getFormNodes()` - Extracts form nodes from the graph
- `getDirectDependencies()` - Returns immediate upstream forms
- `getTransitiveDependencies()` - Returns all transitive upstream forms

### Extensible Data Sources

The data source system follows a plugin architecture that makes it easy to add new sources without modifying core UI logic.

**Interface:**
```typescript
interface PrefillDataSource {
  id: string;
  label: string;
  getItems(context: PrefillContext): PrefillOption[];
}
```

**Built-in Sources:**
1. `globalDataSource` - System-level data (action metadata, client info)
2. `directDependencyDataSource` - Fields from direct upstream forms
3. `transitiveDependencyDataSource` - Fields from transitive upstream forms

**Adding a New Source:**
```typescript
// 1. Create the data source
const myCustomSource: PrefillDataSource = {
  id: 'custom-source',
  label: 'Custom Data',
  getItems(context) {
    return [/* your options */];
  },
};

// 2. Register it
import { dataSourceRegistry } from './dataSources';
dataSourceRegistry.register(myCustomSource);
```

The modal automatically displays all registered sources without any UI changes.

### State Management

The application uses React hooks for state management:

- **`useJourneyGraph`**: Fetches and caches the graph data, provides form nodes and lookup map
- **`usePrefillMappings`**: Manages local mapping state with methods to get, set, and clear mappings

Mappings are stored in a normalized structure:
```typescript
Record<formId, Record<fieldKey, PrefillMapping | null>>
```

## API Integration

### Backend Server

The application is designed to work with the Avantos challenge backend server:

```bash
# Clone and run the backend server
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start
```

The backend server runs at `http://localhost:3001`.

### Configuration

Create a `.env` file in the project root:

```env
# Backend API URL (default: http://localhost:3001)
VITE_API_URL=http://localhost:3001

# Use mock data instead of real API (for demo/testing)
VITE_USE_MOCK=true
```

### Mock Data

The application includes built-in mock data that simulates the API response. This allows the app to work standalone without the backend server. The mock data is automatically used when:
- `VITE_USE_MOCK=true` is set in the environment
- The backend server is unavailable

### Expected API Response Structure

```typescript
{
  nodes: GraphNode[];     // Form nodes and other components
  edges: GraphEdge[];     // Dependencies between nodes
  forms: Record<string, FormDefinition>;  // Form schemas
}
```

- `nodes`: Array of graph nodes (forms have `component_type: 'form'`)
- `edges`: Array of edges representing dependencies (source → target)
- `forms`: Map of form definitions with field schemas

## Tradeoffs and Assumptions

### Assumptions

1. **API Response Shape**: The API returns a graph with `nodes`, `edges`, and `forms` properties. Form nodes have `component_type: 'form'` or `type: 'form'`.

2. **Field Schema**: Forms use JSON Schema format for field definitions with `properties` containing field metadata.

3. **Edge Direction**: Edges point from dependency to dependent (source → target means target depends on source).

4. **No Persistence**: Changes are stored in React state only. The API is read-only.

### Tradeoffs

1. **No Redux**: Used React hooks instead of Redux for simplicity. For larger applications with more complex state, Redux or Zustand might be preferable.

2. **CSS over CSS-in-JS**: Plain CSS files for styling to keep dependencies minimal and build times fast.

3. **No Form Validation**: The mapping modal doesn't validate field type compatibility. A production system might want to filter options by compatible types.

4. **Eager Loading**: All graph data is loaded upfront. For very large graphs, pagination or lazy loading might be needed.

5. **No Undo/Redo**: Mapping changes cannot be undone. A production system might benefit from history tracking.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
