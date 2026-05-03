import { useState, useMemo } from 'react';
import { PrefillOption } from '../dataSources';
import './MappingModal.css';

interface MappingModalProps {
  isOpen: boolean;
  fieldLabel: string;
  groupedOptions: Map<string, { label: string; options: PrefillOption[] }>;
  onSelect: (option: PrefillOption) => void;
  onClose: () => void;
}

export function MappingModal({
  isOpen,
  fieldLabel,
  groupedOptions,
  onSelect,
  onClose,
}: MappingModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<PrefillOption | null>(null);

  // Filter options based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedOptions;
    }

    const query = searchQuery.toLowerCase();
    const filtered = new Map<string, { label: string; options: PrefillOption[] }>();

    groupedOptions.forEach((group, key) => {
      const matchingOptions = group.options.filter(
        opt =>
          opt.label.toLowerCase().includes(query) ||
          opt.displayPath.toLowerCase().includes(query) ||
          opt.sourceLabel.toLowerCase().includes(query)
      );

      if (matchingOptions.length > 0) {
        filtered.set(key, { label: group.label, options: matchingOptions });
      }
    });

    return filtered;
  }, [groupedOptions, searchQuery]);

  const handleSelect = () => {
    if (selectedOption) {
      onSelect(selectedOption);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedOption(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">Select data element to map</h2>
          <p className="modal-subtitle">Mapping to: {fieldLabel}</p>
        </div>

        <div className="modal-search">
          <input
            type="text"
            className="modal-search-input"
            placeholder="Search data elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-content">
          {filteredGroups.size === 0 ? (
            <div className="modal-empty">No matching data elements found</div>
          ) : (
            Array.from(filteredGroups.entries()).map(([groupId, group]) => (
              <div key={groupId} className="modal-group">
                <h3 className="modal-group-title">{group.label}</h3>
                <div className="modal-group-options">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      className={`modal-option ${selectedOption?.id === option.id ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(option)}
                      role="option"
                      aria-selected={selectedOption?.id === option.id}
                    >
                      <div className="modal-option-info">
                        <span className="modal-option-label">{option.label}</span>
                        <span className="modal-option-source">{option.sourceLabel}</span>
                      </div>
                      <span className="modal-option-path">{option.displayPath}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-select"
            onClick={handleSelect}
            disabled={!selectedOption}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
