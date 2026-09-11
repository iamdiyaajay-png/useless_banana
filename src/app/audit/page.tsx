import React from 'react';
import { prisma } from '@/lib/services';
import { OfficialCard } from '@/components/ui/OfficialCard';

export const revalidate = 0;

export default async function GlobalAuditLogsPage() {
  const events = await prisma.auditEvent.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50
  });

  const getEventCategoryColor = (type: string) => {
    if (type.includes('REGISTERED')) return 'var(--gov-blue)';
    if (type.includes('ANALYSIS') || type.includes('DETECTED') || type.includes('CURVATURE')) return '#4a148c'; 
    if (type.includes('BANANAPRINT') || type.includes('SPECIMEN')) return '#006064'; 
    if (type.includes('DATING') || type.includes('MATCH') || type.includes('COMPATIBILITY') || type.includes('PARTNER') || type.includes('RELATIONSHIP')) return '#cc0000'; 
    if (type.includes('DOCUMENT')) return '#e65100'; 
    if (type.includes('VERIFIED') || type.includes('VERIFICATION')) return '#2e7d32'; 
    return 'var(--text-light)';
  };

  const getEventIcon = (type: string) => {
    if (type.includes('REGISTERED')) return '🏛️';
    if (type.includes('ANALYSIS') || type.includes('DETECTED') || type.includes('CURVATURE')) return '🔬';
    if (type.includes('BANANAPRINT') || type.includes('SPECIMEN')) return '🧬';
    if (type.includes('DATING') || type.includes('MATCH') || type.includes('COMPATIBILITY') || type.includes('PARTNER') || type.includes('RELATIONSHIP')) return '💘';
    if (type.includes('DOCUMENT')) return '📜';
    if (type.includes('VERIFIED') || type.includes('VERIFICATION')) return '🔐';
    return '📌';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Global Audit Logs</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Chronological history of all registry events.
        </p>
      </div>

      <OfficialCard title="MASTER AUDIT RECORD">
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)' }}>No events recorded.</div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ position: 'absolute', top: '0', bottom: '0', left: '20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
             
             {events.map((evt: any) => {
               const color = getEventCategoryColor(evt.eventType);
               const icon = getEventIcon(evt.eventType);
               return (
                 <div key={evt.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
                    <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', backgroundColor: color, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', boxShadow: '0 0 0 4px var(--ivory)' }}>
                       {icon}
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', flex: 1, boxShadow: 'var(--shadow-sm)' }}>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                         <span>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(evt.timestamp)}</span>
                         <span style={{ fontFamily: 'monospace' }}>{evt.bananaId}</span>
                       </div>
                       <div style={{ fontWeight: 'bold', color: color, marginBottom: '8px', fontSize: '0.95rem' }}>
                         {evt.eventType.replace(/_/g, ' ')}
                       </div>
                       <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                         {evt.description}
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </OfficialCard>
    </div>
  );
}
