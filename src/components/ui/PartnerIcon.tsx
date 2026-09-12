import React from 'react';

export function PartnerIcon({ icon, size = '3rem', style = {} }: { icon?: string | null, size?: string, style?: React.CSSProperties }) {
  if (!icon) return <div style={{ fontSize: size, lineHeight: 1, ...style }}>🍽️</div>;

  const isImage = icon.startsWith('data:image/') || icon.startsWith('http');

  if (isImage) {
    return (
      <img 
        src={icon} 
        alt="Partner Profile" 
        style={{ 
          width: size, 
          height: size, 
          objectFit: 'cover', 
          borderRadius: '50%',
          border: '2px solid var(--border-color)',
          ...style 
        }} 
      />
    );
  }

  return <div style={{ fontSize: size, lineHeight: 1, ...style }}>{icon}</div>;
}
