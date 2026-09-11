import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Simple pagination (optional)
    const limitParam = searchParams.get('limit');
    const take = limitParam ? parseInt(limitParam) : 50;

    const specimens = await prisma.banana.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        analyses: { take: 1, orderBy: { timestamp: 'desc' } },
        documents: { where: { status: 'VALID' } }
      }
    });

    return NextResponse.json({
      success: true,
      data: specimens
    });
  } catch (error) {
    console.error('Error fetching specimens:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
