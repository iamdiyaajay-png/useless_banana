import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ specimenId: string }> }
) {
  try {
    const { specimenId } = await params;
    const isSovereignId = specimenId.startsWith('BNR-');

    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: specimenId } : { id: specimenId },
    });

    if (!specimen) {
      return NextResponse.json(
        { success: false, error: 'Specimen not found' },
        { status: 404 }
      );
    }

    const analyses = await prisma.analysis.findMany({
      where: { bananaId: specimen.id },
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error(`Error fetching analyses for specimen:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
