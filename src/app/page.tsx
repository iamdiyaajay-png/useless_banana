import React from 'react';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/services';

// Revalidate page occasionally or dynamic depending on requirements
export const revalidate = 0;

export default async function Home() {
  const bananas = await prisma.banana.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Central Registry Dashboard</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Welcome to the National Banana Registry. View recently registered subjects below.
        </p>
      </div>

      <OfficialCard title="Recent Registrations">
        {bananas.length === 0 ? (
          <p>No subjects registered yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px', width: '60px' }}>Photo</th>
                <th style={{ padding: '12px' }}>Registration No.</th>
                <th style={{ padding: '12px' }}>Official Name</th>
                <th style={{ padding: '12px' }}>Origin</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bananas.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      {b.photo ? <img src={b.photo} alt={b.officialName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: '#999' }}>N/A</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                    <Link href={`/registry/${b.id}`} style={{ fontWeight: 'bold' }}>
                      {b.registrationNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '12px' }}>{b.officialName}</td>
                  <td style={{ padding: '12px' }}>{b.origin || 'Unknown'}</td>
                  <td style={{ padding: '12px' }}>
                    <StatusBadge status={b.registryStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </OfficialCard>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link 
          href="/registry" 
          style={{ 
            display: 'inline-block', 
            padding: '16px 32px', 
            backgroundColor: 'var(--gov-blue)', 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            borderRadius: '4px',
            fontSize: '1.1rem',
            letterSpacing: '1px'
          }}
        >
          VIEW FULL REGISTRY ARCHIVE
        </Link>
      </div>
    </div>
  );
}
