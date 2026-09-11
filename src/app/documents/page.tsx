import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import DocumentVaultPage from '../registry/[id]/documents/page';

export const revalidate = 0;

export default async function GlobalDocumentsPage() {
  // Try to find the canonical demo banana first
  let banana = await prisma.banana.findUnique({
    where: { id: 'BNR-KL-2026-004821' }
  });

  // Fallback to most recently registered banana if demo is missing
  if (!banana) {
    banana = await prisma.banana.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  if (!banana) return notFound();

  return <DocumentVaultPage params={Promise.resolve({ id: banana.id })} />;
}
