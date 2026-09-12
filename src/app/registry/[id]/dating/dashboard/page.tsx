import React from 'react';
import { prisma } from '@/lib/services';
import { notFound, redirect } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';
import { PartnerIcon } from '@/components/ui/PartnerIcon';

export const revalidate = 0;

export default async function DatingDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({ 
    where: { id },
    include: {
      relationships: {
        include: { foodPartner: true }
      }
    }
  });

  if (!banana) return notFound();
  if (banana.datingAvailability === 'NOT_ACTIVATED') redirect(`/registry/${id}/dating`);

  const partners = await prisma.foodPartner.findMany();
  
  const currentRelationship = banana.relationships.find(r => r.status === 'IN_RELATIONSHIP');

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
              <div style={{ backgroundColor: '#ffe6e6', padding: '24px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
                <PartnerIcon icon={partner.imageIcon} size="6rem" />
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
                  <Link href={`/registry/${id}/dating/partner/${partner.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '10px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
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
                <PartnerIcon icon={currentRelationship.foodPartner.imageIcon} size="3rem" />
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
            <Link href={`/registry/${id}/dating/compare`} style={{ display: 'block', padding: '12px', backgroundColor: 'var(--gov-blue-light)', color: 'var(--gov-blue-dark)', textDecoration: 'none', borderRadius: '4px', border: '1px solid var(--gov-blue)', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
              ⚖️ Compare Partners
            </Link>
            <Link href={`/registry/${id}`} style={{ display: 'block', padding: '12px', backgroundColor: '#fff', color: 'var(--text-dark)', textDecoration: 'none', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
              View Life Record
            </Link>
            <Link href="/admin" style={{ display: 'block', padding: '12px', backgroundColor: '#fff', color: '#b91c1c', textDecoration: 'none', borderRadius: '4px', border: '1px dashed #fca5a5', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
              🔒 Edit Partners (Admin)
            </Link>
          </OfficialCard>
        </div>
      </div>

    </div>
  );
}
