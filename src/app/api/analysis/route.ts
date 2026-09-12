export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma, logEvent } from '@/lib/services';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { specimenId, curvature, ripeness, straightnessIndex, detectionConfidence, peelAssessment, classification } = payload;

    if (!specimenId) {
      return NextResponse.json({ success: false, error: 'specimenId is required' }, { status: 400 });
    }

    const isSovereignId = specimenId.startsWith('BNR-');

    // Verify specimen exists
    const specimen = await prisma.banana.findFirst({ 
      where: isSovereignId ? { registrationNumber: specimenId } : { id: specimenId } 
    });
    if (!specimen) {
      return NextResponse.json({ success: false, error: 'Specimen not found' }, { status: 404 });
    }

    // Determine Condition Score
    let conditionScore = 100;
    if (ripeness < 40) conditionScore -= (40 - ripeness) * 0.5;
    if (ripeness > 85) conditionScore -= (ripeness - 85) * 1.5;
    if (curvature < 20) conditionScore -= 10;
    if (curvature > 60) conditionScore -= 15;
    conditionScore = Math.max(0, Math.min(100, Math.round(conditionScore)));

    // Create Analysis Record
    const analysis = await prisma.analysis.create({
      data: {
        bananaId: specimen.id,
        analysisMethod: 'OPENCV_REST_API',
        detectionConfidence: detectionConfidence || 0,
        curvature: curvature || 0,
        straightnessIndex: straightnessIndex || 0,
        ripeness: ripeness || 0,
        peelAssessment: peelAssessment || 'Unknown',
        conditionIndex: conditionScore,
        modelSource: 'Heuristic CV Pipeline v1.0 (API)',
        version: '1.0'
      }
    });

    // Log the event
    await logEvent(
      specimen.id,
      'ANALYSIS_COMPLETED',
      `Analysis #${analysis.id.slice(0,8)} completed via REST API.`,
      'ANALYSIS_ENGINE',
      { curvature, ripeness, conditionScore, classification }
    );

    return NextResponse.json({
      success: true,
      data: analysis
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
