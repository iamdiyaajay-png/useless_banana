import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  const linkStyle = {
    display: 'block',
    padding: '12px 16px',
    color: 'var(--text-dark)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border-color)',
    fontWeight: '500'
  };

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#fff',
      borderRight: '1px solid var(--border-color)',
      minHeight: 'calc(100vh - 80px)', // Adjust based on header
      padding: '20px 0'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '20px', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Administration
      </div>
      <nav>
        <Link href="/" style={linkStyle}>Dashboard</Link>
        <Link href="/register" style={linkStyle}>Register New Entity</Link>
        <Link href="/verify" style={linkStyle}>Verify Document</Link>
        <Link href="/audit" style={linkStyle}>Audit Logs</Link>
      </nav>
      <div style={{ padding: '0 20px', marginTop: '32px', marginBottom: '20px', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Analysis Tools
      </div>
      <nav>
        <Link href="/analysis/curvature" style={linkStyle}>Curvature Checker</Link>
      </nav>
    </aside>
  );
}
