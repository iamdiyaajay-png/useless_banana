import React from 'react';
import Link from 'next/link';

export default async function DatingLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <header style={{ borderBottom: '3px solid var(--gov-blue)', paddingBottom: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>💘</span> BANANA COMPATIBILITY & RELATIONSHIP DIVISION
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
            Official Culinary Matchmaking Services
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Link href={`/registry/${id}`} style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Return to Registry
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
