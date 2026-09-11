'use client';

import React, { useState } from 'react';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { logBackgroundCheck, calculateCompatibility, acceptMatch, rejectMatch } from '@/app/actions/dating';
import { useRouter } from 'next/navigation';

export function CompatibilityActions({ bananaId, partnerId, partnerName }: { bananaId: string, partnerId: string, partnerName: string }) {
  const router = useRouter();
  
  const [bgCheckDone, setBgCheckDone] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundCheck = async () => {
    setCalculating(true);
    await logBackgroundCheck(bananaId, partnerName);
    
    const res = await calculateCompatibility(bananaId, partnerId);
    if (res.error) {
      setError(res.error);
    } else {
      setResult(res);
      setBgCheckDone(true);
    }
    setCalculating(false);
  };

  const handleAccept = async () => {
    if (!result) return;
    const res = await acceptMatch(bananaId, partnerId, result.score, result.risk);
    if (res.success) {
      router.push(`/registry/${bananaId}/dating/dashboard`);
    } else {
      setError(res.error || null);
    }
  };

  const handleReject = async () => {
    await rejectMatch(bananaId, partnerId);
    router.push(`/registry/${bananaId}/dating/dashboard`);
  };

  if (!bgCheckDone) {
    return (
      <OfficialCard title="Compatibility Services">
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          A formal background check must be completed before compatibility can be assessed and a match can be accepted.
        </p>
        <button 
          onClick={handleBackgroundCheck} 
          disabled={calculating}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: calculating ? 'not-allowed' : 'pointer' }}
        >
          {calculating ? 'RUNNING BACKGROUND CHECK...' : 'RUN BACKGROUND CHECK 🔍'}
        </button>
        {error && <div style={{ color: 'var(--status-red)', marginTop: '16px' }}>{error}</div>}
      </OfficialCard>
    );
  }

  return (
    <OfficialCard title="💘 MATCHING ASSESSMENT">
      <div style={{ backgroundColor: '#fff', border: '2px solid var(--border-color)', padding: '24px', borderRadius: '4px', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>COMPATIBILITY SCORE</div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: result.score > 80 ? 'var(--status-green)' : result.score > 50 ? 'var(--status-warning)' : 'var(--status-red)' }}>
          {result.score}%
        </div>
        
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
           <span style={{ color: 'var(--text-light)' }}>Risk Level</span>
           <strong style={{ color: result.risk === 'LOW' ? 'var(--status-green)' : result.risk === 'MODERATE' ? 'var(--status-warning)' : 'var(--status-red)' }}>{result.risk}</strong>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>DETERMINISTIC BREAKDOWN</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>Traditional Pairing</span> <strong>{result.breakdown.traditional}%</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>Taste Chemistry</span> <strong>{result.breakdown.taste}%</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>Texture Alignment</span> <strong>{result.breakdown.texture}%</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>Pairing Frequency</span> <strong>{result.breakdown.frequency}%</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>Partner Stability</span> <strong>{result.breakdown.stability}%</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0' }}><span>History Score</span> <strong>{result.breakdown.history}%</strong></div>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.5' }}>
        "{result.explanation} {result.riskReason}"
      </div>

      <div style={{ borderTop: '2px solid var(--gov-blue)', paddingTop: '16px', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--gov-blue)', fontWeight: 'bold' }}>SYSTEM VERDICT</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '4px 0' }}>{result.verdict}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Recommendation: {result.recommendation}</div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={handleReject} style={{ flex: 1, padding: '16px', backgroundColor: '#fff', color: 'var(--status-red)', border: '2px solid var(--status-red)', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          REJECT MATCH ✖
        </button>
        <button onClick={handleAccept} style={{ flex: 1, padding: '16px', backgroundColor: 'var(--status-green)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          ACCEPT MATCH ✓
        </button>
      </div>
      {error && <div style={{ color: 'var(--status-red)', marginTop: '16px', textAlign: 'center' }}>{error}</div>}
    </OfficialCard>
  );
}
