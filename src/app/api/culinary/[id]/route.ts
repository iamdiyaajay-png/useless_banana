export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const partner = await prisma.foodPartner.findUnique({
      where: { id },
      include: {
        relationships: {
          include: { banana: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Food partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error(`Error fetching food partner:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
