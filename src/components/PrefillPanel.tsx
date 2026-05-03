import { useMemo, useState } from 'react';
import { FormNode, ActionBlueprintGraph, FormField, PrefillMapping } from '../types/journey';
import { PrefillOption, dataSourceRegistry } from '../dataSources';
import { getDirectDependencies, getTransitiveDependencies } from '../utils/graph';
import { FieldMappingRow } from './FieldMappingRow';
import { MappingModal } from './MappingModal';
import { EmptyState } from './EmptyState';
import './PrefillPanel.css';

interface PrefillPanelProps {
  selectedForm: FormNode | null;
  graph: ActionBlueprintGraph | null;
  formsMap: Map<string, FormNode>;
  getMapping: (formId: string, fieldKey: string) => PrefillMapping | null;
  setMapping: (formId: string, fieldKey: string, option: PrefillOption) => void;
  clearMapping: (formId: string, fieldKey: string) => void;
}

export function PrefillPanel({
  selectedForm,
  graph,
  formsMap,
  getMapping,
  setMapping,
  clearMapping,
}: PrefillPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<FormField | null>(null);

  // Compute dependencies and available options when form is selected
  const { directDependencies, transitiveDependencies, groupedOptions } = useMemo(() => {
    if (!selectedForm || !graph) {
      return {
        directDependencies: [],
        transitiveDependencies: [],
        groupedOptions: new Map(),
      };
    }

    const direct = getDirectDependencies(graph, selectedForm.id, formsMap);
    const transitive = getTransitiveDependencies(graph, selectedForm.id, formsMap);

    const context = {
      graph,
      selectedFormId: selectedForm.id,
      formsById: formsMap,
      directDependencies: direct,
      transitiveDependencies: transitive,
    };

    const options = dataSourceRegistry.getGroupedOptions(context);

    return {
      directDependencies: direct,
      transitiveDependencies: transitive,
      groupedOptions: options,
    };
  }, [selectedForm, graph, formsMap]);

  const handleConfigureMapping = (field: FormField) => {
    setActiveField(field);
    setModalOpen(true);
  };

  const handleSelectOption = (option: PrefillOption) => {
    if (selectedForm && activeField) {
      setMapping(selectedForm.id, activeField.key, option);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveField(null);
  };

  if (!selectedForm) {
    return (
      <div className="prefill-panel">
        <EmptyState
          title="Select a form"
          description="Choose a form from the list to configure its prefill mappings"
        />
      </div>
    );
  }

  return (
    <div className="prefill-panel">
      <div className="prefill-panel-header">
        <h2 className="prefill-panel-title">Prefill Configuration</h2>
        <p className="prefill-panel-form-name">{selectedForm.name}</p>
        <div className="prefill-panel-meta">
          <span className="prefill-panel-meta-item">
            {selectedForm.fields.length} fields
          </span>
          <span className="prefill-panel-meta-item">
            {directDependencies.length} direct dependencies
          </span>
          <span className="prefill-panel-meta-item">
            {transitiveDependencies.length} transitive dependencies
          </span>
        </div>
      </div>

      <div className="prefill-panel-content">
        {selectedForm.fields.length === 0 ? (
          <EmptyState
            title="No fields"
            description="This form has no configurable fields"
          />
        ) : (
          <div className="prefill-panel-fields">
            {selectedForm.fields.map((field) => (
              <FieldMappingRow
                key={field.key}
                field={field}
                mapping={getMapping(selectedForm.id, field.key)}
                onConfigureMapping={() => handleConfigureMapping(field)}
                onClearMapping={() => clearMapping(selectedForm.id, field.key)}
              />
            ))}
          </div>
        )}
      </div>

      <MappingModal
        isOpen={modalOpen}
        fieldLabel={activeField?.label ?? ''}
        groupedOptions={groupedOptions}
        onSelect={handleSelectOption}
        onClose={handleCloseModal}
      />
    </div>
  );
}
