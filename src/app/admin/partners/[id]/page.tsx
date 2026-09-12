import React from 'react';
import { prisma } from '@/lib/services';
import { isAuthenticated, updateFoodPartner } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { PartnerIcon } from '@/components/ui/PartnerIcon';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminPartnerEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  const { id } = await params;
  const partner = await prisma.foodPartner.findUnique({ where: { id } });

  if (!partner) return notFound();

  // Helper to pre-populate arrays as comma separated string
  const redFlagsStr = JSON.parse(partner.redFlags || '[]').join(', ');
  const greenFlagsStr = JSON.parse(partner.greenFlags || '[]').join(', ');

  // Create bound action with ID
  const updateAction = updateFoodPartner.bind(null, id);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/partners" style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Database</Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Edit Love File: {partner.name}</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Update profile image, flags, and ex-stories.</p>

      <OfficialCard title="Partner Profile Editor">
        <form action={updateAction} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Name</label>
              <input type="text" name="name" defaultValue={partner.name} required style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
              
              <label style={{ display: 'block', fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}>Upload Image (Overrides Emoji)</label>
              <input type="file" name="imageFile" accept="image/*" style={{ width: '100%', padding: '10px', border: '1px dashed var(--gov-blue)', borderRadius: '4px', backgroundColor: '#f0f9ff' }} />
            </div>
            <div style={{ width: '120px', textAlign: 'center' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Current</label>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <PartnerIcon icon={partner.imageIcon} size="4rem" />
              </div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '4px' }}>Emoji Fallback</label>
              <input type="text" name="imageIcon" defaultValue={partner.imageIcon?.startsWith('data:') ? '' : (partner.imageIcon || '')} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1.5rem', textAlign: 'center' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Personality Type</label>
            <input type="text" name="personalityType" defaultValue={partner.personalityType || ''} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Description</label>
            <textarea name="description" defaultValue={partner.description || ''} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }} />
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '24px' }}>
             <h3 style={{ margin: '0 0 16px 0', color: '#b91c1c' }}>Red Flags (Comma Separated)</h3>
             <textarea name="redFlags" defaultValue={redFlagsStr} rows={3} placeholder="e.g. Too sweet, Gets sticky, Melts fast" style={{ width: '100%', padding: '10px', border: '1px solid #fca5a5', borderRadius: '4px', backgroundColor: '#fef2f2', resize: 'vertical' }} />
          </div>

          <div>
             <h3 style={{ margin: '0 0 16px 0', color: '#15803d' }}>Green Flags (Comma Separated)</h3>
             <textarea name="greenFlags" defaultValue={greenFlagsStr} rows={3} placeholder="e.g. Crunchy, Reliable, Classic" style={{ width: '100%', padding: '10px', border: '1px solid #86efac', borderRadius: '4px', backgroundColor: '#f0fdf4', resize: 'vertical' }} />
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ex-Story / Dating History</label>
            <textarea name="datingHistory" defaultValue={partner.datingHistory || ''} rows={4} placeholder="Describe their past relationships..." style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Culinary History</label>
            <textarea name="culinaryHistory" defaultValue={partner.culinaryHistory || ''} rows={4} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '16px' }}>
            SAVE PROFILE CHANGES
          </button>
        </form>
      </OfficialCard>
    </div>
  );
}
