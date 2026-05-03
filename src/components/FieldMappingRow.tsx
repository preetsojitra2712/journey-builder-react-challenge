import { FormField, PrefillMapping } from '../types/journey';
import './FieldMappingRow.css';

interface FieldMappingRowProps {
  field: FormField;
  mapping: PrefillMapping | null;
  onConfigureMapping: () => void;
  onClearMapping: () => void;
}

export function FieldMappingRow({
  field,
  mapping,
  onConfigureMapping,
  onClearMapping,
}: FieldMappingRowProps) {
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearMapping();
  };

  return (
    <div
      className="field-mapping-row"
      onClick={onConfigureMapping}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onConfigureMapping();
        }
      }}
    >
      <div className="field-mapping-info">
        <span className="field-mapping-name">
          {field.label}
          {field.required && <span className="field-required">*</span>}
        </span>
        <span className="field-mapping-type">{field.type}</span>
      </div>
      
      <div className="field-mapping-value">
        {mapping ? (
          <>
            <span className="field-mapping-path">{mapping.displayPath}</span>
            <button
              className="field-mapping-clear"
              onClick={handleClearClick}
              aria-label="Clear mapping"
            >
              ×
            </button>
          </>
        ) : (
          <span className="field-mapping-empty">No prefill configured</span>
        )}
      </div>
    </div>
  );
}
