import React from 'react';
import Link from 'next/link';

export function GovernmentHeader() {
  return (
    <header style={{
      backgroundColor: 'var(--gov-blue)',
      color: '#fff',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '4px solid var(--muted-gold)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Fictional Three-Banana Emblem Placeholder */}
        <div style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: 'var(--muted-gold)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'var(--gov-blue)'
        }}>
          🍌³
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>NATIONAL BANANA REGISTRY</h1>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Department of Agricultural Classification</div>
        </div>
      </div>
      <nav style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Registry</Link>
        <Link href="/analysis" style={{ color: '#fff', textDecoration: 'none' }}>Analysis</Link>
        <Link href="/analysis/curvature" style={{ color: '#fff', textDecoration: 'none' }}>Curvature</Link>
        <Link href="/dating" style={{ color: '#fff', textDecoration: 'none' }}>Dating</Link>
        <Link href="/documents" style={{ color: '#fff', textDecoration: 'none' }}>Documents</Link>
      </nav>
    </header>
  );
}
