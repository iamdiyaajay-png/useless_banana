import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const isDocNumber = id.startsWith('BNR/');

    const document = await prisma.document.findFirst({
      where: isDocNumber ? { documentNumber: id } : { id: id },
      include: { banana: true }
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error(`Error fetching document:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
