import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isSovereignId = id.startsWith('BNR-');

    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: id } : { id: id },
      include: {
        analyses: { orderBy: { timestamp: 'desc' }, take: 1 }
      }
    });

    if (!specimen) {
      return NextResponse.json({ success: false, error: 'Specimen not found' }, { status: 404 });
    }

    const partners = await prisma.foodPartner.findMany();
    const latestAnalysis = specimen.analyses[0];
    const ripeness = latestAnalysis?.ripeness || 50; // Default to 50 if unknown

    // Calculate match scores
    const matches = partners.map(partner => {
      let score = 50; // Baseline compatibility

      // Simple heuristic based on partner personality
      if (partner.personalityType?.includes('Steamed') || partner.name === 'Puttu') {
        score += (ripeness > 70) ? 30 : 10; // Puttu prefers sweeter/ripe bananas
      } else if (partner.personalityType?.includes('Spicy') || partner.name === 'Beef Curry') {
        score += (ripeness < 60) ? 35 : 5; // Spicy food prefers firmer, less sweet bananas
      } else if (partner.name === 'Ghee') {
        score += 40; // Everyone loves ghee
      } else {
        score += Math.floor(Math.random() * 20); // Random variance for others
      }

      // Cap at 99
      score = Math.min(99, score);

      return {
        partner,
        compatibilityScore: score,
        matchReasons: [
          score > 70 ? 'Excellent texture alignment' : 'Acceptable texture alignment',
          'Compatible chemical profile'
        ]
      };
    });

    // Sort by highest compatibility
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return NextResponse.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error(`Error fetching specimen matches:`, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
