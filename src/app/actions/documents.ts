'use server';

import { prisma, logEvent } from '@/lib/services';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

type DocType = 'BANADHAAR' | 'REGISTRATION_CERT' | 'BIRTH_CERT' | 'PHYSICAL_REPORT' | 'VARIETY_REPORT' | 'COMPATIBILITY_CERT' | 'COMPLETE_FILE';

const DOC_PREFIXES: Record<DocType, string> = {
  BANADHAAR: 'BNR/ID',
  REGISTRATION_CERT: 'BNR/REG',
  BIRTH_CERT: 'BNR/BC',
  PHYSICAL_REPORT: 'BNR/BIA',
  VARIETY_REPORT: 'BNR/VAR',
  COMPATIBILITY_CERT: 'BNR/DAT',
  COMPLETE_FILE: 'NBR/COMPLETE'
};

export async function generateDocument(bananaId: string, documentType: DocType) {
  try {
    const banana = await prisma.banana.findUnique({
      where: { id: bananaId },
      include: {
        analyses: true,
        relationships: { include: { foodPartner: true } },
        documents: { where: { documentType }, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!banana) throw new Error('Banana not found');

    // Validation
    if (documentType === 'PHYSICAL_REPORT' || documentType === 'VARIETY_REPORT') {
      if (banana.analyses.length === 0) throw new Error('Required analysis record is unavailable.');
    }
    if (documentType === 'COMPATIBILITY_CERT') {
      if (banana.relationships.length === 0) throw new Error('No compatibility record found.');
    }

    // Determine Version
    const existingDocs = banana.documents;
    const nextVersion = existingDocs.length > 0 ? (parseFloat(existingDocs[0].version || '1.0') + 0.1).toFixed(1) : '1.0';

    if (existingDocs.length > 0) {
      await prisma.document.update({
        where: { id: existingDocs[0].id },
        data: { status: 'EXPIRED' } // Old version expired
      });
    }

    // Generate Numbers
    const year = new Date().getFullYear();
    const suffix = banana.registrationNumber.split('-').pop(); // e.g. BNR-KL-2026-004821 -> 004821
    const baseNumber = `${DOC_PREFIXES[documentType]}/${year}/${suffix}`;
    const documentNumber = nextVersion !== '1.0' ? `${baseNumber}-V${nextVersion.replace('.', '')}` : baseNumber;

    // Cryptographic Lock: Hash(documentNumber + bananaPrintHash + timestamp)
    // Require an existing BananaPrint to cryptographically tie the document to
    if (!banana.bananaPrintHash) {
      throw new Error('Specimen must have an active BananaPrint before documents can be issued cryptographically.');
    }

    const issueDate = new Date();
    const documentHashBase = `${documentNumber}:${banana.bananaPrintHash}:${issueDate.toISOString()}`;
    const documentHash = crypto.createHash('sha256').update(documentHashBase).digest('hex');
    
    // UI Verification Code (short-form)
    const verificationCode = documentHash.slice(0, 8).toUpperCase();
    const qrReference = `http://localhost:3000/verify/document/${verificationCode}`;

    // Create DB Record
    await prisma.document.create({
      data: {
        bananaId,
        documentType,
        documentNumber,
        version: nextVersion,
        verificationCode,
        documentHash,
        qrReference,
        status: 'VALID'
      }
    });

    await logEvent(
      bananaId,
      'DOCUMENT_GENERATED',
      `${documentType.replace('_', ' ')} (v${nextVersion}) generated. Doc No: ${documentNumber}`,
      'DOCUMENT_VAULT'
    );

    revalidatePath(`/registry/${bananaId}/documents`);
    return { success: true, documentNumber };
  } catch (err: any) {
    console.error('Doc Gen Error:', err);
    return { error: `DOCUMENT COULD NOT BE GENERATED: ${err.message}` };
  }
}

export async function logDocumentPrint(bananaId: string, documentType: string) {
  await logEvent(
    bananaId,
    'DOCUMENT_DOWNLOADED',
    `${documentType.replace('_', ' ')} downloaded/printed via Vault.`,
    'DOCUMENT_VAULT'
  );
}
