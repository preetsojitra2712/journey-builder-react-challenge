import { useState, useCallback, useMemo } from 'react';
import { MappingState, PrefillMapping, FormNode, ActionBlueprintGraph } from '../types/journey';
import { PrefillOption } from '../dataSources';

interface UsePrefillMappingsResult {
  mappings: MappingState;
  getMapping: (formId: string, fieldKey: string) => PrefillMapping | null;
  setMapping: (formId: string, fieldKey: string, option: PrefillOption) => void;
  clearMapping: (formId: string, fieldKey: string) => void;
  initializeMappings: (formNodes: FormNode[], graph: ActionBlueprintGraph) => void;
}

/**
 * Hook for managing prefill mappings state.
 * Provides methods to get, set, and clear mappings for form fields.
 */
export function usePrefillMappings(): UsePrefillMappingsResult {
  const [mappings, setMappings] = useState<MappingState>({});

  /**
   * Initializes mappings from form nodes and any existing input_mapping
   * configuration in the graph.
   */
  const initializeMappings = useCallback(
    (formNodes: FormNode[], graph: ActionBlueprintGraph) => {
      const initialMappings: MappingState = {};

      for (const form of formNodes) {
        initialMappings[form.id] = {};

        // Find the node to check for existing input_mapping
        const node = graph.nodes.find(
          n => n.data.component_id === form.id || n.data.id === form.id
        );

        for (const field of form.fields) {
          // Check if there's an existing mapping in the graph
          const existingMapping = node?.data.input_mapping?.[field.key];

          if (existingMapping && existingMapping.type === 'prefill') {
            // Parse the existing mapping value
            const mapping = parseExistingMapping(
              form.id,
              field.key,
              existingMapping.value
            );
            initialMappings[form.id][field.key] = mapping;
          } else {
            initialMappings[form.id][field.key] = null;
          }
        }
      }

      setMappings(initialMappings);
    },
    []
  );

  const getMapping = useCallback(
    (formId: string, fieldKey: string): PrefillMapping | null => {
      return mappings[formId]?.[fieldKey] ?? null;
    },
    [mappings]
  );

  const setMapping = useCallback(
    (formId: string, fieldKey: string, option: PrefillOption) => {
      const newMapping: PrefillMapping = {
        targetFormId: formId,
        targetFieldKey: fieldKey,
        sourceType: option.sourceType,
        sourceId: option.sourceId,
        sourceLabel: option.sourceLabel,
        sourceFieldKey: option.fieldKey,
        displayPath: option.displayPath,
      };

      setMappings((prev: MappingState) => ({
        ...prev,
        [formId]: {
          ...prev[formId],
          [fieldKey]: newMapping,
        },
      }));
    },
    []
  );

  const clearMapping = useCallback((formId: string, fieldKey: string) => {
    setMappings((prev: MappingState) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [fieldKey]: null,
      },
    }));
  }, []);

  return useMemo(
    () => ({
      mappings,
      getMapping,
      setMapping,
      clearMapping,
      initializeMappings,
    }),
    [mappings, getMapping, setMapping, clearMapping, initializeMappings]
  );
}

/**
 * Parses an existing mapping value string into a PrefillMapping object.
 * Expected format: "formId.fieldKey" or "global.fieldKey"
 */
function parseExistingMapping(
  targetFormId: string,
  targetFieldKey: string,
  value: string
): PrefillMapping | null {
  const parts = value.split('.');
  if (parts.length < 2) return null;

  const sourceId = parts[0];
  const sourceFieldKey = parts.slice(1).join('.');
  const isGlobal = sourceId === 'global';

  return {
    targetFormId,
    targetFieldKey,
    sourceType: isGlobal ? 'global' : 'form',
    sourceId,
    sourceLabel: isGlobal ? 'Global' : sourceId,
    sourceFieldKey,
    displayPath: value,
  };
}
