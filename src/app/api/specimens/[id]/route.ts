export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if the id is a Sovereign ID (starts with BNR-) or a standard UUID
    const isSovereignId = id.startsWith('BNR-');

    const specimen = await prisma.banana.findFirst({
      where: isSovereignId ? { registrationNumber: id } : { id: id },
      include: {
        analyses: { orderBy: { timestamp: 'desc' } },
        documents: true,
        auditEvents: { orderBy: { timestamp: 'desc' } },
        relationships: {
          include: { foodPartner: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!specimen) {
      return NextResponse.json(
        { success: false, error: 'Specimen not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: specimen
    });
  } catch (error) {
    console.error(`Error fetching specimen:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
