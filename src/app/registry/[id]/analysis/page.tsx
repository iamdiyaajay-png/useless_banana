export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { AnalysisEngine } from '@/components/AnalysisEngine';

export const revalidate = 0;

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id }
  });

  if (!banana) return notFound();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>BANANA ANALYSIS ENGINE</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Real-time physical and optical inspection for {banana.officialName}.
        </p>
      </div>

      {!banana.photo ? (
        <div style={{ backgroundColor: 'var(--status-red-light)', border: '1px solid var(--status-red)', padding: '24px', borderRadius: '4px' }}>
          <strong style={{ color: 'var(--status-red)', fontSize: '1.2rem' }}>ANALYSIS UNAVAILABLE</strong>
          <p style={{ marginTop: '8px', marginBottom: '24px' }}>No specimen image is currently associated with this banana for standard analysis.</p>
          <a 
            href={`/registry/${banana.id}/analysis/curvature`}
            style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'var(--gov-blue)', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            🍌 LAUNCH CURVATURE CHECKER INSTEAD
          </a>
        </div>
      ) : (
        <AnalysisEngine bananaId={banana.id} photoUrl={banana.photo} />
      )}
    </div>
  );
}
