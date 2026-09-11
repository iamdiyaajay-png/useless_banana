import React from 'react';

export function StatusBadge({ status }: { status: string }) {
  let color = 'var(--text-dark)';
  let bg = '#eee';

  if (status === 'ACTIVE' || status === 'VALID') {
    color = 'var(--status-green)';
    bg = 'var(--status-green-light)';
  } else if (status === 'WARNING' || status === 'PENDING') {
    color = 'var(--status-warning)';
    bg = 'var(--status-warning-light)';
  } else if (status === 'REJECTED' || status === 'REVOKED') {
    color = 'var(--status-red)';
    bg = 'var(--status-red-light)';
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color,
      backgroundColor: bg,
      border: `1px solid ${color}`
    }}>
      {status}
    </span>
  );
}
