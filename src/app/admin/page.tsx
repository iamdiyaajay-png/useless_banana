export const dynamic = 'force-dynamic';
import React from 'react';
import { adminLogin, isAuthenticated } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';

export const metadata = {
  title: 'Admin Portal - Pazamayi Sheriyayi'
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAuthenticated()) {
    redirect('/admin/partners');
  }

  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }}>
      <OfficialCard title="ADMINISTRATIVE ACCESS">
        <div style={{ marginBottom: '24px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Restricted to authorized officials of the Pazamayi Sheriyayi.
        </div>
        
        {error === 'invalid' && (
          <div style={{ backgroundColor: 'var(--status-red-light)', border: '1px solid var(--status-red)', color: 'var(--status-red)', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ACCESS DENIED: Invalid email or password.
          </div>
        )}

        <form action={adminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ padding: '14px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
          >
            SECURE LOGIN
          </button>
        </form>
      </OfficialCard>
    </div>
  );
}
