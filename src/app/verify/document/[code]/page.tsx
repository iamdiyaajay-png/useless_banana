export const dynamic = 'force-dynamic';
import React from 'react';
import { verifyRecord } from '@/app/actions/verify';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';

export const revalidate = 0;

export default async function QRVerificationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  const result = await verifyRecord('QR_REFERENCE', code);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--gov-blue)', margin: '0 0 8px 0' }}>DIGITAL DOCUMENT VERIFICATION</h1>
        <p style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px' }}>Pazamayi Sheriyayi</p>
      </div>

      <OfficialCard title="AUTHENTICATION RESULT">
        {result.success ? (
          <div>
            <div style={{ backgroundColor: result.status === 'VALID' ? 'var(--status-green-light)' : 'var(--status-warning-light)', padding: '24px', borderRadius: '4px', textAlign: 'center', marginBottom: '32px', border: `2px solid ${result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)'}` }}>
               <h2 style={{ color: result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)', margin: 0, fontSize: '1.5rem' }}>
                 {result.status === 'VALID' ? '✅ AUTHENTIC DOCUMENT' : `⚠️ ${result.message}`}
               </h2>
               <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>
                 Verification Reference: {result.verificationReference}
               </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Document Type</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{result.data.documentType.replace('_', ' ')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Document Number</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.documentNumber}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Issued To (Banana)</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--gov-blue)' }}>{result.data.banana.officialName}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Banana ID</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.bananaId}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Issue Date</td>
                  <td style={{ padding: '12px' }}>{new Date(result.data.issueDate).toLocaleDateString()} (v{result.data.version})</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Document Status</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)' }}>{result.data.status}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '40px', padding: '16px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
               <div>
                 <strong>REGISTRY RECORD:</strong> MATCHED<br/>
                 <strong>DOCUMENT INTEGRITY:</strong> VERIFIED
               </div>
               <div style={{ textAlign: 'right', color: 'var(--text-light)' }}>
                 Verified on {new Date().toLocaleString()}
               </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ backgroundColor: 'var(--status-red-light)', padding: '24px', borderRadius: '4px', textAlign: 'center', marginBottom: '24px', border: '2px solid var(--status-red)' }}>
               <h2 style={{ color: 'var(--status-red)', margin: 0, fontSize: '1.5rem' }}>
                 ❌ VERIFICATION FAILED
               </h2>
               <p style={{ marginTop: '16px', color: 'var(--text-dark)', fontWeight: 'bold' }}>{result.error}</p>
               <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                 Verification Reference: {result.verificationReference}
               </div>
            </div>
          </div>
        )}
      </OfficialCard>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/verify" style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Return to Main Verification Portal
        </Link>
      </div>
    </div>
  );
}
