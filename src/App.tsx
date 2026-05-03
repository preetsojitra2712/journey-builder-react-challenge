import { useState, useEffect } from 'react';
import { useJourneyGraph, usePrefillMappings } from './hooks';
import { AppLayout, FormList, PrefillPanel, LoadingState, ErrorState } from './components';
import './styles/global.css';

export function App() {
  const { graph, formNodes, formsMap, loading, error, refetch } = useJourneyGraph();
  const { getMapping, setMapping, clearMapping, initializeMappings } = usePrefillMappings();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Initialize mappings when form nodes are loaded
  useEffect(() => {
    if (formNodes.length > 0 && graph) {
      initializeMappings(formNodes, graph);
    }
  }, [formNodes, graph, initializeMappings]);

  const selectedForm = selectedFormId ? formsMap.get(selectedFormId) ?? null : null;

  if (loading) {
    return (
      <AppLayout
        leftPanel={<LoadingState message="Loading forms..." />}
        rightPanel={<div />}
      />
    );
  }

  if (error) {
    return (
      <AppLayout
        leftPanel={
          <ErrorState
            message={error.message}
            onRetry={refetch}
          />
        }
        rightPanel={<div />}
      />
    );
  }

  return (
    <AppLayout
      leftPanel={
        <FormList
          forms={formNodes}
          selectedFormId={selectedFormId}
          onSelectForm={setSelectedFormId}
        />
      }
      rightPanel={
        <PrefillPanel
          selectedForm={selectedForm}
          graph={graph}
          formsMap={formsMap}
          getMapping={getMapping}
          setMapping={setMapping}
          clearMapping={clearMapping}
        />
      }
    />
  );
}

export default App;
