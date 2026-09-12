'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyRecord } from '@/app/actions/verify';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { MatchEngine } from '@/components/MatchEngine';

function VerificationResult({ result, onReset }: { result: any, onReset: () => void }) {
  if (!result) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      {result.success ? (
        <div style={{ backgroundColor: '#fff', border: `2px solid ${result.status === 'VALID' || result.status === 'ACTIVE' || result.message.includes('AUTHENTIC') ? 'var(--status-green)' : 'var(--status-warning)'}`, borderRadius: '4px', padding: '24px' }}>
           <h2 style={{ color: result.status === 'VALID' || result.status === 'ACTIVE' || result.message.includes('AUTHENTIC') ? 'var(--status-green)' : 'var(--status-warning)', margin: '0 0 16px 0', fontSize: '1.5rem' }}>
             {result.message.includes('AUTHENTIC') ? '✅ ' : '⚠️ '}{result.message}
           </h2>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '24px' }}>Verification Reference: {result.verificationReference}</div>
           
           {result.isBanana && (
             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
               <tbody>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold', width: '40%' }}>Banana Name</td><td style={{ padding: '12px' }}>{result.data.officialName}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Banana ID</td><td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.id}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Registration No.</td><td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.registrationNumber}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Registry Status</td><td style={{ padding: '12px', color: 'var(--status-green)', fontWeight: 'bold' }}>{result.data.registryStatus}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Registration Date</td><td style={{ padding: '12px' }}>{new Date(result.data.registrationDate).toLocaleDateString()}</td></tr>
                 <tr><td style={{ padding: '12px', fontWeight: 'bold' }}>BananaPrint ID</td><td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.bananaPrintId || 'PENDING'}</td></tr>
               </tbody>
             </table>
           )}

           {result.isDoc && (
             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
               <tbody>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold', width: '40%' }}>Document Type</td><td style={{ padding: '12px' }}>{result.data.documentType}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Document No.</td><td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.documentNumber}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Issued To</td><td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--gov-blue)' }}>{result.data.banana?.officialName}</td></tr>
                 <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '12px', fontWeight: 'bold' }}>Banana ID</td><td style={{ padding: '12px', fontFamily: 'monospace' }}>{result.data.bananaId}</td></tr>
                 <tr><td style={{ padding: '12px', fontWeight: 'bold' }}>Document Status</td><td style={{ padding: '12px', fontWeight: 'bold', color: result.data.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)' }}>{result.data.status}</td></tr>
               </tbody>
             </table>
           )}

           <button onClick={onReset} style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: 'transparent', border: '2px solid var(--gov-blue)', color: 'var(--gov-blue)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
             VERIFY ANOTHER RECORD
           </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--status-red-light)', border: '2px solid var(--status-red)', borderRadius: '4px', padding: '24px', textAlign: 'center' }}>
           <h2 style={{ color: 'var(--status-red)', margin: '0 0 8px 0', fontSize: '1.5rem' }}>❌ VERIFICATION FAILED</h2>
           <p style={{ fontWeight: 'bold', margin: '0 0 16px 0' }}>Reason: {result.error}</p>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '24px' }}>Verification Reference: {result.verificationReference}</div>
           <button onClick={onReset} style={{ padding: '12px 24px', backgroundColor: 'var(--status-red)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
             TRY AGAIN
           </button>
        </div>
      )}
    </div>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const targetBananaId = searchParams.get('target') || undefined;

  const [activeTab, setActiveTab] = useState<'ID' | 'REG' | 'DOC' | 'VISUAL'>('ID');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleVerify = async (type: 'BANANA_ID' | 'REGISTRATION_NUMBER' | 'DOCUMENT_NUMBER') => {
    setLoading(true);
    setResult(null);
    const res = await verifyRecord(type, query);
    setResult(res);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Invalid file type.');
        return;
      }
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const tabs = [
    { id: 'ID', label: 'Banana ID' },
    { id: 'REG', label: 'Registration No.' },
    { id: 'DOC', label: 'Document No.' },
    { id: 'VISUAL', label: 'Specimen Image' }
  ];

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Left: Input */}
      <div style={{ flex: '2 1 600px' }}>
         <OfficialCard title="SELECT VERIFICATION METHOD">
           <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setResult(null); setQuery(''); setPhotoUrl(null); }}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab.id ? '4px solid var(--gov-blue)' : '4px solid transparent',
                    color: activeTab === tab.id ? 'var(--gov-blue)' : 'var(--text-light)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Input Area */}
           {!result && activeTab !== 'VISUAL' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Enter {activeTab === 'ID' ? 'Banana ID' : activeTab === 'REG' ? 'Registration Number' : 'Document Number'}:
                </label>
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder={activeTab === 'ID' ? 'BNR-KL-2026-000000' : activeTab === 'REG' ? 'REG-2026-000000' : 'BNR/REG/2026/000000'}
                  style={{ padding: '12px', fontSize: '1.2rem', fontFamily: 'monospace', border: '2px solid var(--border-color)', borderRadius: '4px' }}
                />
                <button 
                  onClick={() => handleVerify(activeTab === 'ID' ? 'BANANA_ID' : activeTab === 'REG' ? 'REGISTRATION_NUMBER' : 'DOCUMENT_NUMBER')}
                  disabled={loading || !query}
                  style={{ padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: loading || !query ? 'not-allowed' : 'pointer', opacity: loading || !query ? 0.7 : 1 }}
                >
                  {loading ? 'VERIFYING RECORD...' : `VERIFY ${activeTab}`}
                </button>
             </div>
           )}

           {activeTab === 'VISUAL' && !photoUrl && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p>Upload a photograph of the specimen to verify its identity against the Pazamayi Sheriyayi using BananaPrint.</p>
                <div style={{ border: '2px dashed var(--border-color)', padding: '40px', textAlign: 'center', borderRadius: '4px' }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '1rem' }} />
                </div>
             </div>
           )}

         </OfficialCard>

         {activeTab === 'VISUAL' && photoUrl && (
            <div style={{ marginTop: '32px' }}>
              <MatchEngine photoUrl={photoUrl} targetBananaId={targetBananaId} />
            </div>
         )}

         <VerificationResult result={result} onReset={() => { setResult(null); setQuery(''); }} />

      </div>

      {/* Right: Quick Links */}
      <div style={{ flex: '1 1 300px' }}>
         <OfficialCard title="VERIFICATION PROCESS">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>1</div>
                <div><strong>Input Data</strong><br/><span style={{ color: 'var(--text-light)' }}>Provide document reference or specimen photo.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '24px', marginLeft: '11px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>2</div>
                <div><strong>Registry Lookup</strong><br/><span style={{ color: 'var(--text-light)' }}>System queries immutable SQLite records.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '24px', marginLeft: '11px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>3</div>
                <div><strong>Status Validation</strong><br/><span style={{ color: 'var(--text-light)' }}>System verifies active/revoked statuses.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '24px', marginLeft: '11px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>4</div>
                <div><strong>Authentication Result</strong><br/><span style={{ color: 'var(--text-light)' }}>Result logged permanently to Audit trail.</span></div>
              </div>
           </div>
         </OfficialCard>
      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <header style={{ borderBottom: '3px solid var(--gov-blue)', paddingBottom: '16px', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: '2rem' }}>
          DIGITAL VERIFICATION & AUTHENTICATION DIVISION
        </h1>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          Official Validation Portal
        </p>
      </header>
      
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading verification service...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
