'use server';

import { prisma, logEvent } from '@/lib/services';
import crypto from 'crypto';

type VerifyType = 'BANANA_ID' | 'REGISTRATION_NUMBER' | 'DOCUMENT_NUMBER' | 'QR_REFERENCE';

export async function verifyRecord(type: VerifyType, query: string) {
  try {
    const verificationRef = `VER-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    let resultData: any = null;
    let isDoc = false;
    let isBanana = false;
    let bananaIdForLog = null;
    let statusText = '';
    let message = '';

    if (!query || query.trim() === '') {
      throw new Error('Verification query cannot be empty.');
    }

    if (type === 'BANANA_ID') {
      const banana = await prisma.banana.findUnique({ where: { id: query.trim() }, include: { relationships: { include: { foodPartner: true } } } });
      if (!banana) throw new Error('No matching registry record was found.');
      isBanana = true;
      bananaIdForLog = banana.id;
      statusText = banana.registryStatus;
      resultData = banana;
      message = 'AUTHENTIC RECORD';
      
      await logEvent(banana.id, 'BANANA_ID_VERIFIED', `Banana identity verified via Verification Portal. Ref: ${verificationRef}`, 'VERIFICATION_PORTAL');
    }
    else if (type === 'REGISTRATION_NUMBER') {
      const banana = await prisma.banana.findUnique({ where: { registrationNumber: query.trim() }, include: { relationships: { include: { foodPartner: true } } } });
      if (!banana) throw new Error('No matching registry record was found.');
      isBanana = true;
      bananaIdForLog = banana.id;
      statusText = banana.registryStatus;
      resultData = banana;
      message = 'AUTHENTIC RECORD';
      
      await logEvent(banana.id, 'BANANA_ID_VERIFIED', `Banana registration verified via Verification Portal. Ref: ${verificationRef}`, 'VERIFICATION_PORTAL');
    }
    else if (type === 'DOCUMENT_NUMBER') {
      const doc = await prisma.document.findUnique({ where: { documentNumber: query.trim() }, include: { banana: true } });
      if (!doc) throw new Error('Document could not be located or does not exist.');
      isDoc = true;
      bananaIdForLog = doc.bananaId;
      statusText = doc.status;
      resultData = doc;
      message = doc.status === 'VALID' ? 'AUTHENTIC AND VALID DOCUMENT' : `AUTHENTIC DOCUMENT — CURRENT STATUS: ${doc.status}`;

      await logEvent(doc.bananaId, 'DOCUMENT_VERIFIED', `Document ${doc.documentNumber} verified via Verification Portal. Ref: ${verificationRef}`, 'VERIFICATION_PORTAL');
    }
    else if (type === 'QR_REFERENCE') {
      // The query is the verificationCode
      const doc = await prisma.document.findFirst({ where: { verificationCode: query.trim() }, include: { banana: true } });
      if (!doc) throw new Error('No corresponding document or registry record could be located.');
      isDoc = true;
      bananaIdForLog = doc.bananaId;
      statusText = doc.status;
      resultData = doc;
      message = doc.status === 'VALID' ? 'AUTHENTIC AND VALID DOCUMENT' : `AUTHENTIC DOCUMENT — CURRENT STATUS: ${doc.status}`;

      await logEvent(doc.bananaId, 'QR_VERIFIED', `Document ${doc.documentNumber} verified via QR Scan. Ref: ${verificationRef}`, 'VERIFICATION_PORTAL');
    }

    return {
      success: true,
      verificationReference: verificationRef,
      type,
      isDoc,
      isBanana,
      status: statusText,
      message,
      data: resultData
    };

  } catch (err: any) {
    return {
      success: false,
      verificationReference: `VER-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      error: err.message
    };
  }
}
