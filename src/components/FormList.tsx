import { FormNode } from '../types/journey';
import { FormListItem } from './FormListItem';
import './FormList.css';

interface FormListProps {
  forms: FormNode[];
  selectedFormId: string | null;
  onSelectForm: (formId: string) => void;
}

export function FormList({ forms, selectedFormId, onSelectForm }: FormListProps) {
  return (
    <div className="form-list">
      <div className="form-list-header">
        <h1 className="form-list-title">Journey Builder</h1>
        <p className="form-list-subtitle">Forms</p>
      </div>
      <div className="form-list-items">
        {forms.map(form => (
          <FormListItem
            key={form.id}
            form={form}
            isSelected={form.id === selectedFormId}
            onSelect={onSelectForm}
          />
        ))}
      </div>
    </div>
  );
}
