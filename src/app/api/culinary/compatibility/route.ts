import { NextResponse } from 'next/server';
import { prisma, logEvent } from '@/lib/services';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { specimenId, culinaryId } = payload;

    if (!specimenId || !culinaryId) {
      return NextResponse.json({ success: false, error: 'specimenId and culinaryId are required' }, { status: 400 });
    }

    const isSovereignId = specimenId.startsWith('BNR-');

    // Fetch the banana and its latest analysis
    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: specimenId } : { id: specimenId },
      include: {
        analyses: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });

    if (!specimen) {
      return NextResponse.json({ success: false, error: 'Specimen not found' }, { status: 404 });
    }

    // Fetch food partner
    const partner = await prisma.foodPartner.findUnique({
      where: { id: culinaryId }
    });

    if (!partner) {
      return NextResponse.json({ success: false, error: 'Food partner not found' }, { status: 404 });
    }

    // Deterministic Compatibility Calculation
    const latestAnalysis = specimen.analyses[0];
    const ripeness = latestAnalysis?.ripeness || 50;
    const curvature = latestAnalysis?.curvature || 35;
    const condition = latestAnalysis?.conditionIndex || 70;

    let textureAlignmentScore = 50;
    let tasteChemistryScore = condition; 
    let traditionalPrecedenceScore = 50;

    // Texture Logic
    if (partner.personalityType?.includes('Steamed') || partner.name === 'Puttu') {
      textureAlignmentScore = ripeness > 70 ? 95 : (ripeness > 50 ? 70 : 40);
      traditionalPrecedenceScore = curvature > 40 ? 80 : 50;
    } else if (partner.personalityType?.includes('Spicy') || partner.name === 'Beef Curry' || partner.name === 'Kadala Curry') {
      textureAlignmentScore = ripeness < 60 ? 90 : 30; // Firm bananas for spicy curries
      traditionalPrecedenceScore = curvature < 30 ? 75 : 45; // Straighter bananas
    } else if (partner.name === 'Ghee') {
      textureAlignmentScore = ripeness > 80 ? 98 : 60; // Extra ripe melts well
      traditionalPrecedenceScore = 90; // Ghee goes with everything traditionally
    } else {
      // Default variance
      textureAlignmentScore = 60 + Math.random() * 20;
      traditionalPrecedenceScore = 50 + Math.random() * 20;
    }

    const compatibilityScore = Math.round(
      (textureAlignmentScore * 0.4) + 
      (tasteChemistryScore * 0.3) + 
      (traditionalPrecedenceScore * 0.3)
    );

    let riskLevel = 'LOW';
    if (compatibilityScore < 40) riskLevel = 'CRITICAL';
    else if (compatibilityScore < 60) riskLevel = 'MODERATE';

    // Find existing relationship
    let relationship = await prisma.relationship.findFirst({
      where: { bananaId: specimen.id, foodPartnerId: partner.id }
    });

    if (relationship) {
      relationship = await prisma.relationship.update({
        where: { id: relationship.id },
        data: {
          compatibilityScore,
          textureAlignmentScore: Math.round(textureAlignmentScore),
          tasteChemistryScore: Math.round(tasteChemistryScore),
          traditionalPrecedenceScore: Math.round(traditionalPrecedenceScore),
          riskLevel,
          updatedAt: new Date()
        }
      });
    } else {
      relationship = await prisma.relationship.create({
        data: {
          bananaId: specimen.id,
          foodPartnerId: partner.id,
          status: 'POTENTIAL_MATCH',
          compatibilityScore,
          textureAlignmentScore: Math.round(textureAlignmentScore),
          tasteChemistryScore: Math.round(tasteChemistryScore),
          traditionalPrecedenceScore: Math.round(traditionalPrecedenceScore),
          riskLevel,
          historyNotes: `Match analyzed computationally. Partner seeks: ${partner.whatItSeeks || 'compatibility'}.`
        }
      });
    }

    await logEvent(
      specimen.id,
      'CULINARY_DATING_ANALYSIS',
      `Culinary compatibility with ${partner.name} assessed at ${compatibilityScore}%.`,
      'DATING_ENGINE',
      { partner: partner.name, score: compatibilityScore, riskLevel }
    );

    return NextResponse.json({
      success: true,
      data: relationship
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error calculating compatibility:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
