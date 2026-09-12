import React from 'react';
import Link from 'next/link';
import { adminLogout, isAuthenticated } from '@/app/actions/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated();

  return (
    <div style={{ backgroundColor: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#18181b', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>NBR ADMIN PORTAL</div>
          {isAuth && <div style={{ backgroundColor: '#cc0000', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px' }}>RESTRICTED ZONE</div>}
        </div>
        
        {isAuth && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>Partner DB</Link>
            <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.9rem' }}>Public Registry</Link>
            <form action={adminLogout}>
              <button type="submit" style={{ backgroundColor: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                LOGOUT
              </button>
            </form>
          </div>
        )}
      </header>

      <main style={{ padding: '32px', flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
