import { PrismaClient } from '@prisma/client';

// Standard singleton pattern for PrismaClient in Next.js (Lazily instantiated via Proxy to avoid Vercel build errors)
const globalForPrisma = global as unknown as { _prisma: PrismaClient };

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma._prisma) {
      globalForPrisma._prisma = new PrismaClient();
      if (process.env.NODE_ENV !== 'production') globalForPrisma._prisma = globalForPrisma._prisma;
    }
    return (globalForPrisma._prisma as any)[prop];
  }
});

/**
 * Audit Event Logger
 * Creates a centralized log for all major events across services.
 */
export async function logEvent(
  bananaId: string,
  eventType: string,
  description: string,
  source: string,
  metadata?: any
) {
  return await prisma.auditEvent.create({
    data: {
      bananaId,
      eventType,
      description,
      source,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

/**
 * ID Generator for Bananas
 * Preferred visual format: BNR-KL-2026-XXXXXX
 */
export async function generateBananaId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  // Count current bananas to generate sequential ID
  const count = await prisma.banana.count();
  const nextNumber = (count + 1).toString().padStart(6, '0');
  
  return `BNR-KL-${currentYear}-${nextNumber}`;
}

/**
 * Generate standard Document Numbers
 * e.g., BNR/REG/2026/004821
 */
export async function generateDocumentNumber(type: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const count = await prisma.document.count({
    where: { documentType: type }
  });
  const nextNumber = (count + 1).toString().padStart(6, '0');
  
  return `BNR/${type}/${currentYear}/${nextNumber}`;
}
