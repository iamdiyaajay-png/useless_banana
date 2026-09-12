'use server';

import { prisma, logEvent } from '@/lib/services';
import foodPartnersSeed from '@/data/foodPartners.json';
import { revalidatePath } from 'next/cache';

export async function ensureFoodPartnersSeeded() {
  const count = await prisma.foodPartner.count();
  if (count === 0) {
    console.log('Seeding FoodPartners from JSON...');
    await prisma.foodPartner.createMany({
      data: foodPartnersSeed
    });
  }
}

export async function activateDatingProfile(bananaId: string, intention: string) {
  try {
    await prisma.banana.update({
      where: { id: bananaId },
      data: {
        datingAvailability: 'OPEN_FOR_MATCHING',
        datingIntention: intention
      }
    });

    await logEvent(
      bananaId,
      'DATING_PROFILE_ACTIVATED',
      `Banana entered the dating pool looking for: ${intention}`,
      'DATING_ENGINE'
    );

    revalidatePath(`/registry/${bananaId}/dating`);
    revalidatePath(`/registry/${bananaId}/dating/dashboard`);
    return { success: true };
  } catch (err) {
    console.error('Activation Error:', err);
    return { error: 'Failed to activate dating profile.' };
  }
}

export async function calculateCompatibility(bananaId: string, partnerId: string) {
  try {
    const partner = await prisma.foodPartner.findUnique({ where: { id: partnerId } });
    if (!partner) throw new Error('Partner not found');

    const hashStr = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const getAttr = (key: string) => {
      const seed = hashStr(`${bananaId}-${partnerId}-${key}`);
      return 40 + (seed % 60);
    };

    const wTrad = getAttr('traditionalPairing') * 0.30;
    const wTaste = getAttr('taste') * 0.25;
    const wText = getAttr('texture') * 0.15;
    const wFreq = getAttr('frequency') * 0.10;
    const wStab = getAttr('stability') * 0.10;
    const wHist = getAttr('history') * 0.10;

    let overallScore = wTrad + wTaste + wText + wFreq + wStab + wHist;
    overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

    // Risk Assessment
    let risk = 'LOW';
    let riskReason = 'No previous relationships recorded and strong stability attributes.';
    const hasHistory = !!partner.datingHistory;
    const redFlags = JSON.parse(partner.redFlags || '[]');

    if (hasHistory || redFlags.length > 1) {
      risk = 'MODERATE';
      riskReason = 'Previous relationship history or minor trust issues detected.';
    }
    if (redFlags.length >= 2) {
      risk = 'HIGH';
      riskReason = 'Complicated relationship history and multiple red flags present.';
    }

    const tradScore = getAttr('traditionalPairing');
    const tasteScore = getAttr('taste');

    // Explanation string
    const explanation = `The banana and ${partner.name} demonstrate a ${overallScore > 80 ? 'strong' : overallScore > 50 ? 'moderate' : 'weak'} structural compatibility. Traditional pairing is evaluated at ${tradScore}%. Taste chemistry is ${tasteScore}%. Relationship history introduces ${risk.toLowerCase()} risk.`;

    const verdict = overallScore > 85 ? 'HIGH COMPATIBILITY' : overallScore > 60 ? 'MODERATE COMPATIBILITY' : 'LOW COMPATIBILITY';
    const recommendation = overallScore > 85 ? 'PROCEED WITH CAUTIOUS OPTIMISM' : overallScore > 60 ? 'PROCEED WITH CAUTION' : 'NOT RECOMMENDED FOR LONG-TERM PAIRING';

    await logEvent(
      bananaId,
      'COMPATIBILITY_CALCULATED',
      `Calculated ${overallScore}% compatibility with ${partner.name}.`,
      'DATING_ENGINE'
    );

    return {
      success: true,
      score: overallScore,
      risk,
      riskReason,
      explanation,
      verdict,
      recommendation,
      breakdown: {
        traditional: tradScore,
        taste: tasteScore,
        texture: getAttr('texture'),
        frequency: getAttr('frequency'),
        stability: getAttr('stability'),
        history: getAttr('history')
      }
    };

  } catch (err) {
    console.error('Calculation Error:', err);
    return { error: 'COMPATIBILITY ASSESSMENT UNAVAILABLE' };
  }
}

export async function logBackgroundCheck(bananaId: string, partnerName: string) {
  await logEvent(
    bananaId,
    'BACKGROUND_CHECK_COMPLETED',
    `Background check run on ${partnerName}.`,
    'DATING_ENGINE'
  );
}

export async function acceptMatch(bananaId: string, partnerId: string, score: number, risk: string) {
  try {
    const partner = await prisma.foodPartner.findUnique({ where: { id: partnerId } });
    if (!partner) throw new Error('Partner not found');

    await prisma.relationship.create({
      data: {
        bananaId,
        foodPartnerId: partnerId,
        status: 'IN_RELATIONSHIP',
        compatibilityScore: score,
        riskLevel: risk,
        startDate: new Date(),
        historyNotes: 'Match officially accepted via Dating Dashboard.'
      }
    });

    await prisma.banana.update({
      where: { id: bananaId },
      data: {
        relationshipStatus: 'IN_RELATIONSHIP',
        currentPartnerId: partnerId,
        datingAvailability: 'IN_RELATIONSHIP'
      }
    });

    await logEvent(
      bananaId,
      'MATCH_ACCEPTED',
      `Match accepted with ${partner.name} (${score}% compatibility).`,
      'DATING_ENGINE'
    );

    await logEvent(
      bananaId,
      'RELATIONSHIP_STARTED',
      `Entered official relationship with ${partner.name}.`,
      'LIFE_RECORD'
    );

    revalidatePath(`/registry/${bananaId}/dating`);
    revalidatePath(`/registry/${bananaId}`);
    return { success: true };
  } catch (err) {
    console.error('Match Error:', err);
    return { error: 'Failed to persist match.' };
  }
}

export async function rejectMatch(bananaId: string, partnerId: string) {
  try {
    const partner = await prisma.foodPartner.findUnique({ where: { id: partnerId } });
    await logEvent(
      bananaId,
      'MATCH_REJECTED',
      `Match rejected with ${partner?.name || 'Unknown'}.`,
      'DATING_ENGINE'
    );
    return { success: true };
  } catch (err) {
    return { error: 'Failed to record rejection.' };
  }
}
