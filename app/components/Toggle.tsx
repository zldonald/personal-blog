'use client';

import { useState } from 'react';

interface ToggleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Toggle({ title, children, defaultOpen = false }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      borderRadius: 'var(--border-radius-sm)',
      marginBottom: 'var(--space-md)',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          width: '100%',
          padding: 'var(--space-sm) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-body)',
          textAlign: 'left',
        }}
      >
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.15s ease',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          ▶
        </span>
        <span style={{ fontWeight: 500 }}>{title}</span>
      </button>
      {isOpen && (
        <div style={{
          paddingLeft: 'var(--space-lg)',
          paddingTop: 'var(--space-sm)',
          borderLeft: '1px solid var(--bg-tertiary)',
          marginLeft: '0.35rem',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
