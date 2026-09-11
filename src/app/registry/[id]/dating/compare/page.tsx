import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { PartnerComparison } from '@/components/PartnerComparison';
import Link from 'next/link';

export const revalidate = 0;

export default async function ComparePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({ where: { id } });
  if (!banana) return notFound();

  const partners = await prisma.foodPartner.findMany();

  return (
    <div>
      <Link href={`/registry/${id}/dating/dashboard`} style={{ display: 'inline-block', marginBottom: '24px', color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Matches
      </Link>

      <OfficialCard title="Partner Comparison Engine">
         <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
           Select two potential food partners to run a deterministic side-by-side compatibility comparison.
         </p>
         
         <PartnerComparison partners={partners} />
      </OfficialCard>
    </div>
  );
}
