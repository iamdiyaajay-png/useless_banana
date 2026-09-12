export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/services';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { notFound } from 'next/navigation';

export default async function RegistrationSuccessPage({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id;
  if (!id) return notFound();

  const banana = await prisma.banana.findUnique({
    where: { id }
  });

  if (!banana) return notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>BANANA REGISTRATION SUCCESSFUL</h1>
      </div>

      <div style={{ 
        backgroundColor: 'var(--status-green-light)', 
        border: '1px solid var(--status-green)',
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ fontSize: '2rem', color: 'var(--status-green)' }}>✓</div>
        <div>
          <h2 style={{ margin: 0, color: 'var(--status-green)', fontSize: '1.25rem' }}>REGISTRATION CONFIRMED</h2>
          <div style={{ color: 'var(--status-green)', opacity: 0.8 }}>Subject has been officially recorded in the Pazamayi Sheriyayi.</div>
        </div>
      </div>

      <OfficialCard title="Registration Details">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 12px', width: '200px' }}>Official Banana Name</th>
              <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{banana.officialName}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 12px' }}>Banana ID / Reg. No.</th>
              <td style={{ padding: '16px 12px', fontFamily: 'monospace', fontSize: '1.1rem' }}>{banana.registrationNumber}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 12px' }}>Registration Date</th>
              <td style={{ padding: '16px 12px' }}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(banana.createdAt)}</td>
            </tr>
            <tr>
              <th style={{ padding: '16px 12px' }}>Registry Status</th>
              <td style={{ padding: '16px 12px' }}>
                <StatusBadge status={banana.registryStatus} />
              </td>
            </tr>
          </tbody>
        </table>
      </OfficialCard>

      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <Link 
          href={`/registry/${banana.id}`}
          style={{
            backgroundColor: 'var(--gov-blue)',
            color: '#fff',
            padding: '12px 24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: '4px',
            textAlign: 'center',
            display: 'inline-block'
          }}
        >
          VIEW BANANA PROFILE
        </Link>
        <Link 
          href="/"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--gov-blue)',
            border: '2px solid var(--gov-blue)',
            padding: '12px 24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: '4px',
            textAlign: 'center',
            display: 'inline-block'
          }}
        >
          GO TO REGISTRY DASHBOARD
        </Link>
      </div>
    </div>
  );
}
