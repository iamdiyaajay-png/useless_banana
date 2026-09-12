'use server';

import { prisma, logEvent, generateBananaId, generateDocumentNumber } from '@/lib/services';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function registerBanana(formData: FormData) {
  try {
    const officialName = formData.get('officialName') as string;
    const origin = formData.get('origin') as string;
    const nickname = formData.get('nickname') as string;
    const photoFile = formData.get('photo') as File;

    if (!officialName || !origin || !photoFile || photoFile.size === 0) {
      return { error: 'REG-ERR-1001: Missing required fields. Please provide Official Name, Origin, and Photo.' };
    }

    if (!photoFile.type.startsWith('image/')) {
      return { error: 'REG-ERR-1002: Invalid file type. Please upload a valid image.' };
    }

    // Handle File Upload as Base64
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const photoUrl = `data:${photoFile.type};base64,${buffer.toString('base64')}`;

    // Database Registration
    const bananaId = await generateBananaId();
    
    const newBanana = await prisma.banana.create({
      data: {
        registrationNumber: bananaId,
        officialName,
        origin,
        nickname: nickname || null,
        photo: photoUrl,
        registryStatus: 'ACTIVE',
      }
    });

    // Log the event
    await logEvent(
      newBanana.id,
      'BANANA_REGISTERED',
      'Banana successfully registered in the Pazamayi Sheriyayi.',
      'REGISTRY'
    );

    // Revalidate registry cache
    revalidatePath('/');
    
    // Redirect to success route
    return { success: true, id: newBanana.id };
  } catch (error) {
    console.error('Registration failed:', error);
    return { error: 'REG-ERR-5000: BANANA REGISTRATION COULD NOT BE COMPLETED. Please review the submitted information and try again.' };
  }
}
