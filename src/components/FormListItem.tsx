import { FormNode } from '../types/journey';
import './FormListItem.css';

interface FormListItemProps {
  form: FormNode;
  isSelected: boolean;
  onSelect: (formId: string) => void;
}

export function FormListItem({ form, isSelected, onSelect }: FormListItemProps) {
  const handleClick = () => {
    onSelect(form.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(form.id);
    }
  };

  return (
    <div
      className={`form-list-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <div className="form-list-item-header">
        <h4 className="form-list-item-name">{form.name}</h4>
        <span className="form-list-item-badge">{form.fields.length} fields</span>
      </div>
      <p className="form-list-item-id">ID: {form.id}</p>
    </div>
  );
}
