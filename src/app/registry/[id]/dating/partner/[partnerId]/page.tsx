import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { CompatibilityActions } from '@/components/CompatibilityActions';
import { PartnerIcon } from '@/components/ui/PartnerIcon';
import Link from 'next/link';

export const revalidate = 0;

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string, partnerId: string }> }) {
  const { id, partnerId } = await params;
  
  const banana = await prisma.banana.findUnique({ where: { id } });
  const partner = await prisma.foodPartner.findUnique({ where: { id: partnerId } });

  if (!banana || !partner) return notFound();

  const greenFlags = JSON.parse(partner.greenFlags || '[]');
  const redFlags = JSON.parse(partner.redFlags || '[]');
  const datingHistory = partner.datingHistory || '';

  return (
    <div>
      <Link href={`/registry/${id}/dating/dashboard`} style={{ display: 'inline-block', marginBottom: '24px', color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Matches
      </Link>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Left Column: Profile & History */}
        <div style={{ flex: '2 1 500px' }}>
          <OfficialCard title="Partner Relationship Profile">
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
              <PartnerIcon icon={partner.imageIcon} size="6rem" style={{ backgroundColor: '#ffe6e6', padding: '12px', border: '4px solid #ffcccc' }} />
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem', color: 'var(--text-dark)' }}>{partner.name}</h2>
                <div style={{ fontSize: '1.2rem', color: 'var(--gov-blue)', fontFamily: 'serif', fontStyle: 'italic' }}>
                  {partner.personalityType}
                </div>
                <div style={{ marginTop: '8px', color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  Looking for: <strong>{partner.whatItSeeks}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ borderBottom: '2px solid var(--status-green)', color: 'var(--status-green)', paddingBottom: '8px', marginBottom: '16px' }}>💚 GREEN FLAGS</h3>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {greenFlags.map((gf: string) => <li key={gf} style={{ marginBottom: '8px' }}>{gf}</li>)}
                </ul>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ borderBottom: '2px solid var(--status-red)', color: 'var(--status-red)', paddingBottom: '8px', marginBottom: '16px' }}>🚩 RED FLAGS</h3>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {redFlags.map((rf: string) => <li key={rf} style={{ marginBottom: '8px' }}>{rf}</li>)}
                  {redFlags.length === 0 && <li style={{ color: 'var(--text-light)' }}>No known red flags.</li>}
                </ul>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', color: 'var(--gov-blue)' }}>💔 LOVE HISTORY</h3>
            {!datingHistory ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No past records available.</p>
            ) : (
              <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{datingHistory}</p>
              </div>
            )}
          </OfficialCard>
        </div>

        {/* Right Column: Actions & Compatibility */}
        <div style={{ flex: '1 1 350px' }}>
          <CompatibilityActions bananaId={id} partnerId={partner.id} partnerName={partner.name} />
        </div>
      </div>
    </div>
  );
}
