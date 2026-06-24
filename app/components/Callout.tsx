interface CalloutProps {
  type?: 'default' | 'insight' | 'warning';
  title?: string;
  children: React.ReactNode;
}

const typeLabels: Record<string, string> = {
  default: 'Note',
  insight: 'Key Insight',
  warning: 'Important',
};

export function Callout({ type = 'default', title, children }: CalloutProps) {
  const showTitle = title !== '';
  const titleText = title || typeLabels[type];

  return (
    <aside className={`callout callout-${type}`}>
      {showTitle && <div className="callout-title">{titleText}</div>}
      <div>{children}</div>
    </aside>
  );
}
