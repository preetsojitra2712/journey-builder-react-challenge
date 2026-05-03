import { useState, useEffect, useMemo } from 'react';
import { fetchActionBlueprintGraph } from '../api/journeyApi';
import { ActionBlueprintGraph, FormNode } from '../types/journey';
import { getFormNodes, createFormsMap } from '../utils/graph';

interface UseJourneyGraphResult {
  graph: ActionBlueprintGraph | null;
  formNodes: FormNode[];
  formsMap: Map<string, FormNode>;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching and managing the journey graph data.
 * Provides parsed form nodes and a lookup map for efficient access.
 */
export function useJourneyGraph(): UseJourneyGraphResult {
  const [graph, setGraph] = useState<ActionBlueprintGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchActionBlueprintGraph();
      setGraph(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch graph'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const formNodes = useMemo(() => {
    if (!graph) return [];
    return getFormNodes(graph);
  }, [graph]);

  const formsMap = useMemo(() => {
    return createFormsMap(formNodes);
  }, [formNodes]);

  return {
    graph,
    formNodes,
    formsMap,
    loading,
    error,
    refetch: fetchGraph,
  };
}
