export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma, logEvent } from '@/lib/services';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { specimenId } = payload;

    if (!specimenId) {
      return NextResponse.json({ success: false, error: 'specimenId is required' }, { status: 400 });
    }

    const isSovereignId = specimenId.startsWith('BNR-');

    // Fetch the banana and its latest analysis
    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: specimenId } : { id: specimenId },
      include: {
        analyses: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    if (!specimen) {
      return NextResponse.json({ success: false, error: 'Specimen not found' }, { status: 404 });
    }

    const latestAnalysis = specimen.analyses[0];
    if (!latestAnalysis) {
      return NextResponse.json({ success: false, error: 'No analysis records found to mint from' }, { status: 400 });
    }

    // Deterministic BananaPrint Generation
    const fCurvature = Math.min(99, Math.round(latestAnalysis.curvature || 0)).toString().padStart(2, '0');
    const fStraightness = Math.min(99, Math.round(latestAnalysis.straightnessIndex || 0)).toString().padStart(2, '0');
    const fRipeness = Math.min(99, Math.round(latestAnalysis.ripeness || 0)).toString().padStart(2, '0');
    
    // Feature Vector for Identity Matching
    const featureSignature = `${fCurvature},${fStraightness},${fRipeness}`;
    const bananaPrintSignature = `CURV:${fCurvature}|STR:${fStraightness}|RIP:${fRipeness}`;
    
    // Deterministic Visual Identity Hash
    const hash = createHash('md5').update(featureSignature).digest('hex').toUpperCase();
    const bananaPrintId = `BP-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
    
    // Advanced Hash (SHA-256) for blockchain/vault verification (Phase 2 requirement)
    const bananaPrintHash = createHash('sha256').update(bananaPrintSignature).digest('hex');

    const bananaPrintVersion = '1.0';
    const bananaPrintGeneratedAt = new Date();

    // Update Banana Master Profile
    const updatedBanana = await prisma.banana.update({
      where: { id: specimen.id },
      data: {
        bananaPrintId,
        bananaPrintVersion,
        featureSignature,
        bananaPrintSignature,
        bananaPrintHash,
        bananaPrintGeneratedAt,
      }
    });

    // Log the events
    await logEvent(
      specimen.id,
      'BANANAPRINT_GENERATED',
      `Visual identity signature minted deterministically.`,
      'BANANAPRINT',
      { bananaPrintId, version: bananaPrintVersion, hash: bananaPrintHash }
    );

    return NextResponse.json({
      success: true,
      data: {
        bananaPrintId: updatedBanana.bananaPrintId,
        bananaPrintSignature: updatedBanana.bananaPrintSignature,
        bananaPrintHash: updatedBanana.bananaPrintHash,
        featureSignature: updatedBanana.featureSignature,
        generatedAt: updatedBanana.bananaPrintGeneratedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error minting BananaPrint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
