import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Link from 'next/link';

export const revalidate = 0;

export default async function RegistryMasterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id },
    include: { 
      auditEvents: { orderBy: { timestamp: 'desc' } },
      analyses: { orderBy: { timestamp: 'desc' }, take: 1 },
      documents: { where: { status: 'VALID' } },
      relationships: { include: { foodPartner: true }, orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  if (!banana) return notFound();

  const latestAnalysis = banana.analyses[0];
  const activeRelationship = banana.relationships[0];

  const getEventCategoryColor = (type: string) => {
    if (type.includes('REGISTERED')) return 'var(--gov-blue)';
    if (type.includes('ANALYSIS') || type.includes('DETECTED') || type.includes('CURVATURE')) return '#4a148c'; // Purple
    if (type.includes('BANANAPRINT') || type.includes('SPECIMEN')) return '#006064'; // Teal
    if (type.includes('DATING') || type.includes('MATCH') || type.includes('COMPATIBILITY') || type.includes('PARTNER') || type.includes('RELATIONSHIP')) return '#cc0000'; // Red/Pink
    if (type.includes('DOCUMENT')) return '#e65100'; // Orange
    if (type.includes('VERIFIED') || type.includes('VERIFICATION')) return '#2e7d32'; // Green
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
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid var(--gov-blue)', paddingBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: 'var(--gov-blue)', fontSize: '2.5rem', letterSpacing: '4px' }}>BANANA DIGITAL PROFILE</h1>
        <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{banana.registrationNumber}</div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        {/* Left Column: Module Status Overview & Core Data */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ width: '160px', height: '160px', backgroundColor: '#f0f0f0', border: '2px solid var(--gov-blue)', overflow: 'hidden' }}>
              {banana.photo ? <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', paddingTop: '60px' }}>NO PHOTO</div>}
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--gov-blue-dark)' }}>{banana.officialName}</h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>Banana ID: <span style={{ fontFamily: 'monospace' }}>{banana.id}</span></div>
            </div>
          </div>

          <OfficialCard title="MODULE STATUS OVERVIEW">
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
               
               {/* Identity */}
               <Link href="/register" style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>IDENTITY</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--status-green)' }}>✓ {banana.registryStatus}</div>
                 <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Registered: {new Date(banana.registrationDate).toLocaleDateString()}</div>
               </Link>

               {/* Analysis */}
               <Link href={`/registry/${banana.id}/analysis`} style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>ANALYSIS</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: latestAnalysis ? 'var(--status-green)' : 'var(--status-warning)' }}>
                   {latestAnalysis ? '✓ Completed' : '⚠️ Pending'}
                 </div>
                 {latestAnalysis && <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Curvature: {latestAnalysis.curvature}° | Ripeness: {latestAnalysis.ripeness}%</div>}
               </Link>

               {/* BananaPrint */}
               <Link href={`/registry/${banana.id}/analysis`} style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>BANANAPRINT</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: banana.bananaPrintId ? 'var(--status-green)' : 'var(--status-warning)' }}>
                   {banana.bananaPrintId ? '✓ Generated' : '⚠️ Pending Analysis'}
                 </div>
                 {banana.bananaPrintId && <div style={{ fontSize: '0.9rem', marginTop: '8px', fontFamily: 'monospace' }}>{banana.bananaPrintId}</div>}
               </Link>

               {/* Relationship */}
               <Link href={`/registry/${banana.id}/dating`} style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>RELATIONSHIP</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: banana.datingAvailability === 'ACTIVE' || banana.relationshipStatus === 'IN_RELATIONSHIP' ? '#cc0000' : 'var(--text-light)' }}>
                   {banana.relationshipStatus === 'IN_RELATIONSHIP' ? `💘 ${activeRelationship?.foodPartner.name}` : banana.datingAvailability === 'ACTIVE' ? '💘 Active Pool' : 'Not Active'}
                 </div>
                 {activeRelationship && <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Compatibility: {activeRelationship.compatibilityScore}%</div>}
               </Link>

               {/* Documents */}
               <Link href={`/registry/${banana.id}/documents`} style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>DOCUMENTS</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: banana.documents.length > 0 ? 'var(--status-green)' : 'var(--status-warning)' }}>
                   {banana.documents.length > 0 ? `✓ ${banana.documents.length} Available` : '⚠️ None Generated'}
                 </div>
               </Link>

               {/* Verification */}
               <Link href={`/verify?target=${banana.id}`} style={{ display: 'block', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>VERIFICATION</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--status-green)' }}>
                   ✓ Enabled
                 </div>
                 <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Verify ID, Doc, or Specimen</div>
               </Link>

             </div>
          </OfficialCard>

        </div>

        {/* Right Column: Banana Life Record */}
        <div style={{ flex: '1 1 400px' }}>
          <OfficialCard title="BANANA LIFE RECORD">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              A complete chronological history of events sourced natively from the master Audit Event system.
            </div>
            
            {banana.auditEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)' }}>No life events recorded.</div>
            ) : (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 {/* The chronological line */}
                 <div style={{ position: 'absolute', top: '0', bottom: '0', left: '20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                 
                 {banana.auditEvents.map((evt: any) => {
                   const color = getEventCategoryColor(evt.eventType);
                   const icon = getEventIcon(evt.eventType);
                   return (
                     <div key={evt.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
                        <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', backgroundColor: color, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', boxShadow: '0 0 0 4px var(--ivory)' }}>
                           {icon}
                        </div>
                        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', flex: 1, boxShadow: 'var(--shadow-sm)' }}>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '4px' }}>
                             {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(evt.timestamp)}
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

      </div>
    </div>
  );
}
