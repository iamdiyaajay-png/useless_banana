import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const partner = await prisma.foodPartner.findUnique({
      where: { id }
    });

    if (!partner) {
      return NextResponse.json({ success: false, error: 'Food partner not found' }, { status: 404 });
    }

    const relationships = await prisma.relationship.findMany({
      where: { foodPartnerId: id },
      include: { banana: true },
      orderBy: { compatibilityScore: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: relationships
    });
  } catch (error) {
    console.error(`Error fetching food partner matches:`, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
