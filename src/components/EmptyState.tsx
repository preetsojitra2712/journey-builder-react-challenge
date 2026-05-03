import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      </div>
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description">{description}</p>}
    </div>
  );
}
