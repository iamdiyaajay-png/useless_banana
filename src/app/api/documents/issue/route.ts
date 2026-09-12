export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma, logEvent, generateDocumentNumber } from '@/lib/services';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { specimenId, documentType } = payload;

    if (!specimenId || !documentType) {
      return NextResponse.json(
        { success: false, error: 'specimenId and documentType are required' }, 
        { status: 400 }
      );
    }

    const isSovereignId = specimenId.startsWith('BNR-');

    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: specimenId } : { id: specimenId },
    });

    if (!specimen) {
      return NextResponse.json({ success: false, error: 'Specimen not found' }, { status: 404 });
    }

    // Require an existing BananaPrint to cryptographically tie the document to
    if (!specimen.bananaPrintHash) {
      return NextResponse.json(
        { success: false, error: 'Specimen must have an active BananaPrint before documents can be issued' }, 
        { status: 400 }
      );
    }

    // Generate Document Number (e.g. BNR/CERT/2026/000001)
    let typePrefix = 'DOC';
    if (documentType.includes('BIRTH')) typePrefix = 'REG';
    if (documentType.includes('IDENTITY')) typePrefix = 'ID';
    if (documentType.includes('ANALYSIS')) typePrefix = 'REP';

    const documentNumber = await generateDocumentNumber(typePrefix);
    
    // Cryptographic Lock: Hash(documentNumber + bananaPrintHash + timestamp)
    const issueDate = new Date();
    const documentHashBase = `${documentNumber}:${specimen.bananaPrintHash}:${issueDate.toISOString()}`;
    const documentHash = createHash('sha256').update(documentHashBase).digest('hex');
    
    // UI Verification Code (short-form)
    const verificationCode = documentHash.slice(0, 8).toUpperCase();

    const document = await prisma.document.create({
      data: {
        bananaId: specimen.id,
        documentType,
        documentNumber,
        issueDate,
        version: '1.0',
        verificationCode,
        documentHash,
        status: 'VALID'
      }
    });

    await logEvent(
      specimen.id,
      'DOCUMENT_ISSUED',
      `Official ${documentType} issued. Verification Code: ${verificationCode}`,
      'VAULT',
      { documentId: document.id, documentNumber, hash: documentHash }
    );

    return NextResponse.json({
      success: true,
      data: document
    }, { status: 201 });

  } catch (error) {
    console.error('Error issuing document:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
