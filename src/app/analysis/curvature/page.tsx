export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import CurvatureCheckerPage from '../../registry/[id]/analysis/curvature/page';

export const revalidate = 0;

export default async function GlobalCurvaturePage() {
  let banana = await prisma.banana.findUnique({
    where: { id: 'BNR-KL-2026-004821' }
  });

  if (!banana) {
    banana = await prisma.banana.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  if (!banana) return notFound();

  return <CurvatureCheckerPage params={Promise.resolve({ id: banana.id })} />;
}
