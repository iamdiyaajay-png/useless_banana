import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET() {
  try {
    const partners = await prisma.foodPartner.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching culinary partners:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
