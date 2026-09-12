export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { isAuthenticated } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { PartnerIcon } from '@/components/ui/PartnerIcon';

export const revalidate = 0;

export default async function AdminPartnersDashboard() {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  const partners = await prisma.foodPartner.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Culinary Partners Database</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Manage profiles, compatibility flags, and dating histories for registry food partners.
        </p>
      </div>

      <OfficialCard title="Registered Partners">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Icon</th>
              <th style={{ padding: '12px 8px' }}>Name</th>
              <th style={{ padding: '12px 8px' }}>Personality</th>
              <th style={{ padding: '12px 8px' }}>Flags</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(partner => {
              const redFlags = JSON.parse(partner.redFlags || '[]');
              const greenFlags = JSON.parse(partner.greenFlags || '[]');
              
              return (
                <tr key={partner.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <PartnerIcon icon={partner.imageIcon} size="2.5rem" />
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{partner.name}</td>
                  <td style={{ padding: '12px 8px' }}>{partner.personalityType}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--status-green)', marginRight: '8px' }}>{greenFlags.length} Green</span>
                      <span style={{ color: 'var(--status-red)' }}>{redFlags.length} Red</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <Link 
                      href={`/admin/partners/${partner.id}`}
                      style={{ padding: '6px 12px', backgroundColor: '#f4f4f5', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      EDIT PROFILE
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </OfficialCard>
    </div>
  );
}
