export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound, redirect } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { activateDatingProfile, ensureFoodPartnersSeeded } from '@/app/actions/dating';

export const revalidate = 0;

export default async function DatingIntakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({ where: { id } });
  if (!banana) return notFound();

  // If already activated, send to dashboard
  if (banana.datingAvailability !== 'NOT_ACTIVATED') {
    redirect(`/registry/${id}/dating/dashboard`);
  }

  // Action to activate
  const handleActivation = async (formData: FormData) => {
    'use server';
    await ensureFoodPartnersSeeded(); // ensure DB is ready before matching
    const intention = formData.get('intention') as string;
    await activateDatingProfile(id, intention);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <OfficialCard title="Dating Profile Activation">
        <div style={{ backgroundColor: 'var(--status-warning-light)', border: '1px solid var(--status-warning)', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
          <strong>NOTICE:</strong> By activating this profile, you consent to have this specimen's visual and physical traits assessed for culinary chemistry.
        </div>

        <form action={handleActivation}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Specimen Name</label>
            <input type="text" value={banana.officialName} disabled style={{ width: '100%', padding: '12px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--gov-blue)' }}>Primary Dating Intention</label>
            <select name="intention" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '1rem' }}>
              <option value="LONG-TERM CULINARY COMPATIBILITY">Long-Term Culinary Compatibility</option>
              <option value="CASUAL SNACKING">Casual Snacking</option>
              <option value="FESTIVE PAIRING">Festive / Traditional Pairing Only</option>
              <option value="UNDECIDED">Undecided</option>
            </select>
          </div>

          <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            ACTIVATE DATING PROFILE 💘
          </button>
        </form>
      </OfficialCard>
    </div>
  );
}
