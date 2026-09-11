'use server';

import { prisma, logEvent } from '@/lib/services';
import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';

export async function saveAnalysisResult(bananaId: string, payload: any) {
  try {
    // Determine Condition Score
    const curvature = payload.curvature || 0;
    const ripeness = payload.ripeness || 0;
    
    let conditionScore = 100;
    if (ripeness < 40) conditionScore -= (40 - ripeness) * 0.5; // too green
    if (ripeness > 85) conditionScore -= (ripeness - 85) * 1.5; // too brown
    if (curvature < 20) conditionScore -= 10; // too straight
    if (curvature > 60) conditionScore -= 15; // too curved
    conditionScore = Math.max(0, Math.min(100, Math.round(conditionScore)));

    // Generate BananaPrint
    const fCurvature = Math.min(99, Math.round(curvature)).toString().padStart(2, '0');
    const fStraightness = Math.min(99, Math.round(payload.straightnessIndex || 0)).toString().padStart(2, '0');
    const fRipeness = Math.min(99, Math.round(ripeness)).toString().padStart(2, '0');
    
    // Feature Vector for Identity Matching
    const featureSignature = `${fCurvature},${fStraightness},${fRipeness}`;
    const bananaPrintSignature = `CURV:${fCurvature}|STR:${fStraightness}|RIP:${fRipeness}`;
    
    // Deterministic Visual Identity Signature ID
    const hash = createHash('md5').update(featureSignature).digest('hex').toUpperCase();
    const bananaPrintId = `BP-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
    
    // Advanced Hash (SHA-256) for blockchain/vault verification
    const bananaPrintHash = createHash('sha256').update(bananaPrintSignature).digest('hex');

    const bananaPrintVersion = '1.0';
    const bananaPrintGeneratedAt = new Date();

    // Create Analysis Record
    const analysis = await prisma.analysis.create({
      data: {
        bananaId,
        analysisMethod: 'OPENCV_BROWSER_HEURISTIC',
        detectionConfidence: payload.detectionConfidence,
        curvature: payload.curvature,
        straightnessIndex: payload.straightnessIndex,
        ripeness: payload.ripeness,
        peelAssessment: payload.peelAssessment,
        conditionIndex: conditionScore,
        modelSource: 'Heuristic CV Pipeline v1.0',
        version: '1.0'
      }
    });

    // Update Banana Master Profile with Latest Summary and BananaPrint
    await prisma.banana.update({
      where: { id: bananaId },
      data: {
        scientificClassification: 'Musa paradisiaca (AI-Assisted)',
        estimatedVariety: 'Cavendish (AI-Estimated)',
        varietyConfidence: 78.5,
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
      bananaId,
      'BANANAPRINT_GENERATED',
      `Visual identity signature generated from banana analysis features.`,
      'BANANAPRINT',
      { bananaPrintId, version: bananaPrintVersion }
    );

    await logEvent(
      bananaId,
      'ANALYSIS_COMPLETED',
      `Analysis #${analysis.id.slice(0,8)} completed via computer vision pipeline.`,
      'ANALYSIS_ENGINE',
      { curvature, ripeness, conditionScore }
    );

    await logEvent(
      bananaId,
      'CURVATURE_COMPLETED',
      `Curvature calculated as ${curvature.toFixed(1)}° (${payload.classification})`,
      'ANALYSIS_ENGINE'
    );

    await logEvent(
      bananaId,
      'RIPENESS_COMPLETED',
      `Ripeness assessed at ${ripeness.toFixed(1)}% (${payload.peelAssessment})`,
      'ANALYSIS_ENGINE'
    );

    revalidatePath(`/registry/${bananaId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to save analysis:', error);
    return { error: 'SYS-ERR-5000: Could not persist analysis results.' };
  }
}
