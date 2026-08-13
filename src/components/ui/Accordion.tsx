// src/components/ui/Accordion.tsx

import React, { useState } from 'react';
import { m3Theme } from '../../theme';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        backgroundColor: m3Theme.surfaceHigh,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${m3Theme.border}`,
        marginBottom: '8px'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isOpen ? m3Theme.surfaceHighest : 'transparent',
          border: 'none',
          color: m3Theme.textPrimary,
          fontWeight: 600,
          fontSize: '13px',
          fontFamily: m3Theme.fontSans,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '10px', color: m3Theme.textMuted }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '0 14px 14px 14px' }}>
          {children}
        </div>
      )}
    </div>
  );
};