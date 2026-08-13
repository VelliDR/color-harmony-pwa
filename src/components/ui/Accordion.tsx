// src/components/ui/Accordion.tsx

import React, { useState } from 'react';
import { m3Theme } from '../../theme';

interface AccordionProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  badge,
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        backgroundColor: m3Theme.surface,
        borderRadius: m3Theme.radius,
        border: `1px solid ${m3Theme.border}`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        flexShrink: 0,            // Elemanların büzülüp sıkışmasını engeller
        boxSizing: 'border-box',  // Kenarlık ve pedinglerin boyutu bozmasını engeller
        width: '100%'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isOpen ? m3Theme.surfaceVariant : 'transparent',
          border: 'none',
          color: m3Theme.textPrimary,
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {title}
          {badge && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '8px',
                backgroundColor: m3Theme.primary,
                color: m3Theme.onPrimary,
                fontWeight: 'bold'
              }}
            >
              {badge}
            </span>
          )}
        </span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '16px', borderTop: `1px solid ${m3Theme.border}`, boxSizing: 'border-box' }}>
          {children}
        </div>
      )}
    </div>
  );
};