export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma, logEvent } from '@/lib/services';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { documentNumber, documentHash } = payload;

    if (!documentNumber) {
      return NextResponse.json({ success: false, error: 'documentNumber is required' }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { documentNumber },
      include: { banana: true }
    });

    if (!document) {
      return NextResponse.json({ 
        success: true, 
        verified: false, 
        reason: 'Document not found in vault registry' 
      });
    }

    if (document.status !== 'VALID') {
      return NextResponse.json({ 
        success: true, 
        verified: false, 
        reason: `Document status is ${document.status}` 
      });
    }

    const specimen = document.banana;

    // Optional Check: If the user provided a hash, check if it matches the stored hash
    if (documentHash && documentHash !== document.documentHash) {
      return NextResponse.json({ 
        success: true, 
        verified: false, 
        reason: 'Provided document hash does not match vault records' 
      });
    }

    // Cryptographic Check: Ensure the underlying banana hasn't changed its identity
    // We recreate the hash using the Banana's CURRENT BananaPrintHash
    if (specimen.bananaPrintHash) {
      const documentHashBase = `${document.documentNumber}:${specimen.bananaPrintHash}:${document.issueDate.toISOString()}`;
      const recomputedHash = createHash('sha256').update(documentHashBase).digest('hex');

      if (recomputedHash !== document.documentHash) {
        return NextResponse.json({ 
          success: true, 
          verified: false, 
          reason: 'Cryptographic failure: The underlying specimen identity has changed since document issuance' 
        });
      }
    } else {
      return NextResponse.json({ 
        success: true, 
        verified: false, 
        reason: 'Underlying specimen lacks cryptographic identity' 
      });
    }

    await logEvent(
      specimen.id,
      'DOCUMENT_VERIFIED',
      `Document ${documentNumber} successfully verified.`,
      'VAULT'
    );

    return NextResponse.json({
      success: true,
      verified: true,
      data: {
        documentNumber: document.documentNumber,
        documentType: document.documentType,
        issueDate: document.issueDate,
        specimen: {
          id: specimen.id,
          registrationNumber: specimen.registrationNumber,
          officialName: specimen.officialName
        }
      }
    });

  } catch (error) {
    console.error('Error verifying document:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
