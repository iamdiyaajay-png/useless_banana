'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function RegistryArchive() {
  const [specimens, setSpecimens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [query, setQuery] = useState('');
  const [variety, setVariety] = useState('');
  const [status, setStatus] = useState('');

  const fetchSpecimens = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (variety) params.append('variety', variety);
      if (status) params.append('status', status);

      const res = await fetch(`/api/specimens/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      
      if (data.success) {
        setSpecimens(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSpecimens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpecimens();
  };

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Sidebar: Filters */}
      <div style={{ flex: '1 1 300px' }}>
        <OfficialCard title="Archive Search & Filter">
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Search Query
              </label>
              <input 
                type="text" 
                placeholder="ID, Name, Alias, Origin..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Variety Filter
              </label>
              <select 
                value={variety} 
                onChange={(e) => setVariety(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="">ALL VARIETIES</option>
                <option value="Musa paradisiaca">Musa paradisiaca</option>
                <option value="Musa acuminata">Musa acuminata</option>
                <option value="Musa balbisiana">Musa balbisiana</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Status Filter
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--gov-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              SUBMIT SEARCH
            </button>
            <button type="button" onClick={() => { setQuery(''); setVariety(''); setStatus(''); setTimeout(fetchSpecimens, 0); }} style={{ padding: '12px', backgroundColor: '#f0f0f0', color: 'var(--text-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>
              RESET
            </button>
          </form>
        </OfficialCard>
      </div>

      {/* Main Content: Results */}
      <div style={{ flex: '3 1 600px' }}>
        <OfficialCard title={`Registry Archive (${loading ? '...' : specimens.length})`}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              Querying National Database...
            </div>
          ) : specimens.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              No specimens matched the given criteria.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', width: '60px' }}>Photo</th>
                  <th style={{ padding: '12px' }}>Registration No.</th>
                  <th style={{ padding: '12px' }}>Official Name</th>
                  <th style={{ padding: '12px' }}>Origin</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {specimens.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {b.photo ? <img src={b.photo} alt={b.officialName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: '#999' }}>N/A</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                      <Link href={`/registry/${b.id}`} style={{ fontWeight: 'bold' }}>
                        {b.registrationNumber}
                      </Link>
                    </td>
                    <td style={{ padding: '12px' }}>{b.officialName}</td>
                    <td style={{ padding: '12px' }}>{b.origin || 'Unknown'}</td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={b.registryStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </OfficialCard>
      </div>

    </div>
  );
}
