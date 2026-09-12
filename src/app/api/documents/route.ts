export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { issueDate: 'desc' },
      include: { banana: true }
    });

    return NextResponse.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
