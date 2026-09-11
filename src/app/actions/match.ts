'use server';

import { prisma, logEvent } from '@/lib/services';

export async function matchBananaIdentity(submittedSignature: string, targetBananaId?: string) {
  try {
    const [subCurv, subStr, subRip] = submittedSignature.split(',').map(Number);
    
    // Fetch all candidates with a BananaPrint
    const candidates = await prisma.banana.findMany({
      where: { bananaPrintId: { not: null } }
    });

    if (candidates.length === 0) {
      return { candidates: [], bestMatch: null };
    }

    const results = candidates.map(banana => {
      const [candCurv, candStr, candRip] = (banana.featureSignature || '0,0,0').split(',').map(Number);
      
      // Calculate normalized Euclidean distance based similarity
      // We assume max possible difference per feature is 100
      const diffCurv = Math.abs(subCurv - candCurv);
      const diffStr = Math.abs(subStr - candStr);
      const diffRip = Math.abs(subRip - candRip);

      // Weighting: Curvature & Straightness are shape features (more important), Ripeness is temporary
      // Weights: Shape 70%, Color 30%
      const shapeDiff = (diffCurv + diffStr) / 2; // 0 to 100
      const colorDiff = diffRip; // 0 to 100

      const weightedDiff = (shapeDiff * 0.7) + (colorDiff * 0.3);
      const similarityScore = Math.max(0, 100 - weightedDiff);
      
      let classification = 'NO SUFFICIENT MATCH';
      if (similarityScore > 95) classification = 'VERY HIGH SIMILARITY';
      else if (similarityScore > 85) classification = 'HIGH SIMILARITY';
      else if (similarityScore > 70) classification = 'MODERATE SIMILARITY';

      return {
        id: banana.id,
        officialName: banana.officialName,
        registrationNumber: banana.registrationNumber,
        photo: banana.photo,
        similarityScore,
        classification,
        comparedFeatures: {
          submitted: { curvature: subCurv, straightness: subStr, ripeness: subRip },
          candidate: { curvature: candCurv, straightness: candStr, ripeness: candRip }
        }
      };
    });

    // Sort by similarity descending
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    
    const bestMatch = results[0].similarityScore > 70 ? results[0] : null;

    // Log Audit Events if an explicit target was provided (Verification flow)
    if (targetBananaId) {
      if (bestMatch && bestMatch.id === targetBananaId) {
        await logEvent(targetBananaId, 'IDENTITY_MATCH_COMPLETED', `Visual Match Successful: ${bestMatch.similarityScore.toFixed(1)}% similarity.`, 'VERIFICATION');
      } else {
        await logEvent(targetBananaId, 'IDENTITY_MATCH_FAILED', `Visual Match Failed. Highest similarity: ${results[0].similarityScore.toFixed(1)}%.`, 'VERIFICATION');
      }
    }

    return { candidates: results, bestMatch };
  } catch (error) {
    console.error('Matching Error:', error);
    return { error: 'SYS-ERR-5002: Identity matching service failed.' };
  }
}
