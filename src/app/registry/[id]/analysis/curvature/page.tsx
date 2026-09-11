import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { CurvatureChecker } from '@/components/analysis/CurvatureChecker';

export const revalidate = 0;

export default async function CurvatureCheckerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id }
  });

  if (!banana) return notFound();

  return <CurvatureChecker bananaId={banana.id} />;
}
