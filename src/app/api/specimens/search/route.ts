import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query');
    const variety = searchParams.get('variety');
    const status = searchParams.get('status');
    const relationship = searchParams.get('relationship');

    const where: Prisma.BananaWhereInput = {};

    if (query) {
      where.OR = [
        { registrationNumber: { contains: query } },
        { officialName: { contains: query } },
        { nickname: { contains: query } },
        { origin: { contains: query } },
        { district: { contains: query } },
        { estimatedVariety: { contains: query } }
      ];
    }

    if (variety) {
      where.estimatedVariety = variety;
    }

    if (status) {
      where.registryStatus = status;
    }

    if (relationship) {
      where.relationshipStatus = relationship;
    }

    const specimens = await prisma.banana.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        analyses: { take: 1, orderBy: { timestamp: 'desc' } }
      }
    });

    return NextResponse.json({
      success: true,
      data: specimens
    });
  } catch (error) {
    console.error('Error searching specimens:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
