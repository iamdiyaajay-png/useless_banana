import React from 'react';

export function OfficialCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="institutional-border" style={{
      backgroundColor: '#fff',
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h2 style={{ 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '12px', 
        marginBottom: '20px',
        fontSize: '1.25rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {title}
      </h2>
      <div>
        {children}
      </div>
    </div>
  );
}
