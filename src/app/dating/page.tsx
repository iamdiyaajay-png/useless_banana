import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';
import DatingIntakePage from '../registry/[id]/dating/page'; // Fallback if not activated

export const revalidate = 0;

export default async function GlobalDatingPage() {
  // Try to find the canonical demo banana first
  let banana = await prisma.banana.findUnique({
    where: { id: 'BNR-KL-2026-004821' },
    include: {
      relationships: {
        include: { foodPartner: true }
      }
    }
  });

  // Fallback to most recently registered banana if demo is missing
  if (!banana) {
    banana = await prisma.banana.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        relationships: {
          include: { foodPartner: true }
        }
      }
    });
  }

  if (!banana) return notFound();

  // If not activated, render the intake page logic
  if (banana.datingAvailability === 'NOT_ACTIVATED') {
    // Reusing the intake component with simulated params
    return <DatingIntakePage params={Promise.resolve({ id: banana.id })} />;
  }

  const partners = await prisma.foodPartner.findMany();
  const currentRelationship = banana.relationships.find((r: any) => r.status === 'IN_RELATIONSHIP');

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Main Content: Partner Grid */}
      <div style={{ flex: '2 1 600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--gov-blue)', marginBottom: '8px' }}>POTENTIAL MATCHES</h2>
          <p style={{ color: 'var(--text-light)' }}>Browse the registry of culinary partners available for compatibility assessment.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {partners.map(partner => (
            <div key={partner.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#ffe6e6', padding: '24px', textAlign: 'center', fontSize: '4rem', borderBottom: '1px solid var(--border-color)' }}>
                {partner.imageIcon || '🍽️'}
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-dark)' }}>{partner.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '12px', textTransform: 'uppercase' }}>{partner.personalityType}</div>
                
                <div style={{ marginBottom: '16px' }}>
                   {JSON.parse(partner.greenFlags || '[]').slice(0, 2).map((gf: string) => (
                     <div key={gf} style={{ fontSize: '0.8rem', color: 'var(--status-green)', marginBottom: '4px' }}>💚 {gf}</div>
                   ))}
                   {JSON.parse(partner.redFlags || '[]').length > 0 && (
                     <div style={{ fontSize: '0.8rem', color: 'var(--status-red)', marginBottom: '4px' }}>🚩 {JSON.parse(partner.redFlags || '[]').length} Red Flags</div>
                   )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href={`/registry/${banana.id}/dating/partner/${partner.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '10px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                    VIEW LOVE FILE 💘
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ flex: '1 1 300px' }}>
        <OfficialCard title="Dating Profile">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Love File No.</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{banana.registrationNumber}</div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Identity</div>
            <div style={{ fontWeight: 'bold' }}>{banana.officialName}</div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Status</div>
            <div style={{ color: banana.datingAvailability === 'OPEN_FOR_MATCHING' ? 'var(--status-green)' : 'var(--gov-blue)', fontWeight: 'bold' }}>{banana.datingAvailability}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Looking For</div>
            <div>{banana.datingIntention}</div>
          </div>
        </OfficialCard>

        {currentRelationship && (
          <div style={{ marginTop: '24px' }}>
            <OfficialCard title="Current Relationship">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '3rem' }}>{currentRelationship.foodPartner.imageIcon}</div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--gov-blue)' }}>{currentRelationship.foodPartner.name}</h3>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Official Partner</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ color: 'var(--text-light)' }}>Compatibility</span>
                <strong style={{ color: 'var(--status-green)' }}>{currentRelationship.compatibilityScore}%</strong>
              </div>
            </OfficialCard>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <OfficialCard title="Quick Actions">
            <Link href={`/registry/${banana.id}/dating/compare`} style={{ display: 'block', padding: '12px', backgroundColor: 'var(--gov-blue-light)', color: 'var(--gov-blue-dark)', textDecoration: 'none', borderRadius: '4px', border: '1px solid var(--gov-blue)', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
              ⚖️ Compare Partners
            </Link>
            <Link href={`/registry/${banana.id}`} style={{ display: 'block', padding: '12px', backgroundColor: '#fff', color: 'var(--text-dark)', textDecoration: 'none', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 'bold', textAlign: 'center' }}>
              View Life Record
            </Link>
          </OfficialCard>
        </div>
      </div>

    </div>
  );
}
