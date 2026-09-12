'use server';

import { prisma } from '@/lib/services';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_EMAIL = 'iamdiyaajay@gmail.com';
const ADMIN_PASS = 'password2444';
const COOKIE_NAME = 'admin_session';

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = (formData.get('password') as string || '').trim();

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    redirect('/admin/partners');
  }

  redirect('/admin?error=invalid');
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin');
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === 'authenticated';
}

export async function updateFoodPartner(id: string, formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  let imageIcon = formData.get('imageIcon') as string;
  const imageFile = formData.get('imageFile') as File | null;
  const description = formData.get('description') as string;
  const personalityType = formData.get('personalityType') as string;
  const redFlagsStr = formData.get('redFlags') as string;
  const greenFlagsStr = formData.get('greenFlags') as string;
  const datingHistory = formData.get('datingHistory') as string;
  const culinaryHistory = formData.get('culinaryHistory') as string;

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    imageIcon = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  }

  const redFlags = redFlagsStr ? JSON.stringify(redFlagsStr.split(',').map(s => s.trim()).filter(Boolean)) : '[]';
  const greenFlags = greenFlagsStr ? JSON.stringify(greenFlagsStr.split(',').map(s => s.trim()).filter(Boolean)) : '[]';

  await prisma.foodPartner.update({
    where: { id },
    data: {
      name,
      imageIcon,
      description,
      personalityType,
      redFlags,
      greenFlags,
      datingHistory,
      culinaryHistory
    }
  });

  redirect('/admin/partners');
}
