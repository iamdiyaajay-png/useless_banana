'use client';

import React, { useState } from 'react';

export function PartnerComparison({ partners }: { partners: any[] }) {
  const [p1Id, setP1Id] = useState<string>('');
  const [p2Id, setP2Id] = useState<string>('');

  const p1 = partners.find(p => p.id === p1Id);
  const p2 = partners.find(p => p.id === p2Id);

  const getAttr = (partner: any, key: string) => {
    if (!partner) return 0;
    try {
      const attr = JSON.parse(partner.compatibilityAttributes || '{}');
      return attr[key] || 0;
    } catch {
      return 0;
    }
  };

  const getScore = (partner: any) => {
    if (!partner) return 0;
    const attr = JSON.parse(partner.compatibilityAttributes || '{}');
    const wTrad = (attr.traditionalPairing || 0) * 0.30;
    const wTaste = (attr.taste || 0) * 0.25;
    const wText = (attr.texture || 0) * 0.15;
    const wFreq = (attr.frequency || 0) * 0.10;
    const wStab = (attr.stability || 0) * 0.10;
    const wHist = (attr.history || 0) * 0.10;
    return Math.max(0, Math.min(100, Math.round(wTrad + wTaste + wText + wFreq + wStab + wHist)));
  };

  const s1 = getScore(p1);
  const s2 = getScore(p2);
  
  let recommendation = null;
  if (p1 && p2) {
    if (s1 > s2) recommendation = p1.name;
    else if (s2 > s1) recommendation = p2.name;
    else recommendation = 'TIED';
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Candidate 1</label>
          <select value={p1Id} onChange={e => setP1Id(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Candidate 2</label>
          <select value={p2Id} onChange={e => setP2Id(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {p1 && p2 && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Factor</th>
                <th style={{ padding: '12px', fontSize: '1.2rem', color: s1 >= s2 ? 'var(--status-green)' : 'inherit' }}>{p1.name} {p1.imageIcon}</th>
                <th style={{ padding: '12px', fontSize: '1.2rem', color: s2 >= s1 ? 'var(--status-green)' : 'inherit' }}>{p2.name} {p2.imageIcon}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Traditional Pairing', key: 'traditionalPairing' },
                { label: 'Taste Chemistry', key: 'taste' },
                { label: 'Texture Alignment', key: 'texture' },
                { label: 'Pairing Frequency', key: 'frequency' },
                { label: 'Partner Stability', key: 'stability' },
                { label: 'History Score', key: 'history' },
              ].map(row => {
                const v1 = getAttr(p1, row.key);
                const v2 = getAttr(p2, row.key);
                return (
                  <tr key={row.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--text-light)' }}>{row.label}</td>
                    <td style={{ padding: '12px', fontWeight: v1 >= v2 ? 'bold' : 'normal', color: v1 > v2 ? 'var(--gov-blue)' : 'inherit' }}>{v1}%</td>
                    <td style={{ padding: '12px', fontWeight: v2 >= v1 ? 'bold' : 'normal', color: v2 > v1 ? 'var(--gov-blue)' : 'inherit' }}>{v2}%</td>
                  </tr>
                );
              })}
              <tr style={{ borderBottom: '2px solid var(--gov-blue)', backgroundColor: '#fafafa' }}>
                <td style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem' }}>OVERALL COMPATIBILITY</td>
                <td style={{ padding: '16px', fontSize: '1.5rem', fontWeight: 'bold', color: s1 > s2 ? 'var(--status-green)' : 'inherit' }}>{s1}%</td>
                <td style={{ padding: '16px', fontSize: '1.5rem', fontWeight: 'bold', color: s2 > s1 ? 'var(--status-green)' : 'inherit' }}>{s2}%</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '32px', textAlign: 'center', backgroundColor: 'var(--gov-blue-light)', border: '2px solid var(--gov-blue)', padding: '24px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--gov-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>DEPARTMENT RECOMMENDATION</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gov-blue-dark)' }}>{recommendation}</div>
          </div>
        </>
      )}
    </div>
  );
}
