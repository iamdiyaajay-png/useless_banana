import React from 'react';
import { prisma } from '@/lib/services';
import Link from 'next/link';

export const revalidate = 0;

export default async function DocumentSelectionPage() {
  const bananas = await prisma.banana.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      documents: true
    }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--gov-blue)', marginBottom: '8px' }}>DOCUMENT VAULT SELECTION</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Select a registered specimen to view their official documentation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {bananas.map(banana => (
          <div key={banana.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            
            {banana.photo ? (
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem' }}>
                🍌
              </div>
            )}

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                ID: {banana.registrationNumber}
              </div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4rem', color: 'var(--gov-blue)' }}>
                {banana.officialName}
              </h3>
              
              <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)' }}>Documents</span>
                  <strong>{banana.documents.length} Files</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)' }}>Variety</span>
                  <strong>{banana.estimatedVariety || 'Unknown'}</strong>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link href={`/registry/${banana.id}/documents`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '12px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                  VIEW VAULT 📁
                </Link>
              </div>
            </div>
          </div>
        ))}

        {bananas.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '16px' }}>No specimens found in the registry.</p>
            <Link href="/register" style={{ display: 'inline-block', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              Register a New Specimen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
