# Journey Builder - Prefill Mapping UI

A React + TypeScript application for configuring prefill mappings in a journey builder workflow. This application allows users to select forms from a directed acyclic graph (DAG) and configure how fields should be prefilled from upstream form data or global data sources.

## Features

- **Form Selection**: Browse and select forms from the journey graph
- **Prefill Configuration**: Configure prefill mappings for each form field
- **DAG Traversal**: Automatically resolves direct and transitive dependencies
- **Extensible Data Sources**: Plugin architecture for adding new data sources
- **Search & Filter**: Search through available data elements in the mapping modal

---

## User Cases

### User Case 1: View all forms
**As a user**, I should be able to open the app and see all forms returned by the action blueprint graph endpoint.

**Example:**
- The app loads forms such as Form A, Form B, Form C, Form D, Form E, and Form F.
- The user can click any form from the left panel.

### User Case 2: Select a form and view fields
**As a user**, I should be able to click a form and see its fields in the prefill configuration panel.

**Example:**
- The user clicks Form D.
- The right panel shows fields like:
  - `dynamic_checkbox_group`
  - `dynamic_object`
  - `email`

### User Case 3: View existing prefill mapping
**As a user**, I should be able to see when a field already has a prefill value.

**Example:**
- Form D.email shows: **Prefilled from Form A.email**

### User Case 4: Clear a prefill mapping
**As a user**, I should be able to remove an existing mapping from a field.

**Example:**
- The user clicks the X button beside Form D.email.
- The mapping is removed.
- The row now says: **No prefill configured**

### User Case 5: Add a prefill mapping from a direct dependency
**As a user**, I should be able to map a field using data from a form that directly connects to the selected form.

**Example:**
- Form D directly depends on Form B.
- The user opens the mapping modal for Form D.dynamic_object.
- The modal shows Form B fields.
- The user selects Form B.email.
- The row updates to: **Prefilled from Form B.email**

### User Case 6: Add a prefill mapping from a transitive dependency
**As a user**, I should be able to map a field using data from an upstream form that is not directly connected but is part of the dependency chain.

**Example:**
- Form D depends on Form B.
- Form B depends on Form A.
- The modal for Form D should include Form A fields because Form A is a transitive dependency.
- The user selects Form A.name.
- The row updates to: **Prefilled from Form A.name**

### User Case 7: Add a prefill mapping from global data
**As a user**, I should be able to map a field using global data.

**Example:**
- The user opens the mapping modal.
- The modal shows Global Data options such as:
  - `action.id`
  - `action.created_at`
  - `client.name`
  - `client.email`
- The user selects client.email.
- The row updates to: **Prefilled from Global.client.email**

### User Case 8: Search available mapping options
**As a user**, I should be able to search inside the modal to quickly find a source field.

**Example:**
- The user types "email" in the search input.
- The modal filters options and shows only matching fields like:
  - Form A.email
  - Form B.email
  - Global.client.email

### User Case 9: Prevent invalid dependency mapping
**As a user**, I should only see valid upstream fields that can prefill the selected form.

**Example:**
- If Form A is selected and it has no upstream dependencies, the modal should not show Form D or downstream forms as sources.
- Only global data should be available unless Form A has dependencies.

### User Case 10: Easy future data source support
**As an engineer**, I should be able to add a new prefill source without changing the modal or core UI.

**Example:**
- A future data source called "External CRM Data" can be added by creating one new data source object and registering it in the data source registry.
- The modal should automatically display the new source if it returns PrefillOption items.

---

## Example Flow

1. User opens the app.
2. App fetches the action blueprint graph.
3. User selects Form D.
4. App calculates Form D's direct dependencies (Form B).
5. App calculates Form D's transitive dependencies (Form A).
6. User clicks the email field.
7. Modal opens with direct dependency fields, transitive dependency fields, and global data.
8. User selects Form A.email.
9. Form D.email now shows Form A.email as its prefill source.
10. User can clear or change that mapping later.

---

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

## Assumptions

1. **API is the source of truth**: The API provides forms, fields, edges, and existing mappings. The app reads this data and allows local editing.

2. **Mapping edits are stored locally**: The challenge only requires viewing and editing the UI state. Changes are not persisted to the backend.

3. **No node graph rendering required**: The UI does not need to render the visual node-based DAG. A list-based form selection is sufficient.

4. **Global data can be mocked**: The challenge allows using any global data. The app provides mock global data (action metadata, client info, user info).

5. **Dependency traversal is generic**: The DAG traversal does not depend on hardcoded form names. It works with any graph structure returned by the API.

6. **Edge direction**: Edges point from dependency to dependent (source → target means target depends on source).

7. **Forms array structure**: The API returns forms as an array. Each node references a form definition via `component_id`.

---

## Tradeoffs

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
