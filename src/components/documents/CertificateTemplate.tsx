import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeader';

export function CertificateTemplate({ type, banana, document }: { type: 'REGISTRATION' | 'BIRTH' | 'COMPATIBILITY', banana: any, document: any }) {
  
  let title = '';
  let bodyContent = null;
  let isCompatibility = type === 'COMPATIBILITY';

  if (type === 'REGISTRATION') {
    title = 'CERTIFICATE OF BANANA REGISTRATION';
    bodyContent = (
      <>
        <p style={{ fontSize: '1.2rem', textAlign: 'center', margin: '40px 0' }}>
          This is to certify that the specimen identified as
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '2.5rem', textAlign: 'center', color: 'var(--gov-blue)', margin: 0 }}>
            {banana.officialName}
          </h3>
          {banana.photo && (
            <div style={{ width: '80px', height: '100px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff' }}>
              <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '1.2rem', margin: '0 0 40px 0' }}>
          has been officially registered in the Pazamayi Sheriyayi.
        </p>
        
        <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Registration Number</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{banana.registrationNumber}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Banana ID</td>
              <td style={{ padding: '12px', fontFamily: 'monospace' }}>{banana.id}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Registration Date</td>
              <td style={{ padding: '12px' }}>{new Date(banana.registrationDate).toLocaleDateString()}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Origin</td>
              <td style={{ padding: '12px' }}>{banana.origin || 'UNKNOWN'}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Registry Status</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--status-green)' }}>{banana.registryStatus}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  } else if (type === 'BIRTH') {
    title = 'CERTIFICATE OF BANANA BIRTH';
    bodyContent = (
      <>
        <p style={{ fontSize: '1.2rem', textAlign: 'center', margin: '40px 0' }}>
          This record formally attests to the estimated origin and emergence of
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '2.5rem', textAlign: 'center', color: 'var(--gov-blue)', margin: 0 }}>
            {banana.officialName}
          </h3>
          {banana.photo && (
            <div style={{ width: '80px', height: '100px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff' }}>
              <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        
        <div style={{ textAlign: 'center', margin: '40px 0', padding: '24px', border: '2px dashed var(--muted-gold)', backgroundColor: '#fffdf5' }}>
           <div style={{ fontSize: '1rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>ESTIMATED DATE OF ORIGIN/BIRTH</div>
           <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gov-blue)' }}>
             {banana.estimatedBirthDate ? new Date(banana.estimatedBirthDate).toLocaleDateString() : 'NOT AVAILABLE'}
           </div>
           {!banana.estimatedBirthDate && <div style={{ fontSize: '0.9rem', color: 'var(--status-red)', marginTop: '8px' }}>Estimation not possible.</div>}
        </div>
        
        <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Banana ID</td>
              <td style={{ padding: '12px', fontFamily: 'monospace' }}>{banana.id}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Origin Location</td>
              <td style={{ padding: '12px' }}>{banana.origin || 'UNKNOWN'}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Estimated Variety</td>
              <td style={{ padding: '12px' }}>{banana.estimatedVariety || 'PENDING ASSESSMENT'}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  } else if (type === 'COMPATIBILITY') {
    title = 'CERTIFICATE OF COMPATIBILITY';
    
    // Find current or latest relationship
    const relationship = banana.relationships.length > 0 ? banana.relationships[0] : null;

    bodyContent = (
      <div style={{ position: 'relative' }}>
        {/* Subtle cute background */}
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none', opacity: 0.05, fontSize: '10rem', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          💘
        </div>

        <p style={{ fontSize: '1.2rem', textAlign: 'center', margin: '40px 0', position: 'relative', zIndex: 1 }}>
          The Pazamayi Sheriyayi has formally assessed the culinary chemistry between
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '0 0 40px 0', position: 'relative', zIndex: 1 }}>
           <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             {banana.photo && (
               <div style={{ width: '80px', height: '100px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff', marginBottom: '16px' }}>
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             )}
             <h3 style={{ fontSize: '1.8rem', color: 'var(--gov-blue)', margin: 0 }}>{banana.officialName}</h3>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Registered Specimen</div>
           </div>
           <div style={{ fontSize: '2rem', color: '#cc0000', margin: '0 24px' }}>&</div>
           <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             {relationship?.foodPartner?.imageIcon && (
               <div style={{ width: '80px', height: '100px', border: '2px solid #cc0000', padding: '2px', backgroundColor: '#fff', marginBottom: '16px' }}>
                 <img src={relationship.foodPartner.imageIcon} alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             )}
             <h3 style={{ fontSize: '1.8rem', color: 'var(--gov-blue)', margin: 0 }}>{relationship ? relationship.foodPartner.name : 'UNKNOWN'}</h3>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Certified Partner</div>
           </div>
        </div>
        
        <div style={{ textAlign: 'center', margin: '40px 0', padding: '24px', backgroundColor: '#ffe6e6', border: '2px solid #ff9999', borderRadius: '8px', position: 'relative', zIndex: 1 }}>
           <div style={{ fontSize: '1rem', color: '#cc0000', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 'bold' }}>OVERALL COMPATIBILITY</div>
           <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#cc0000', lineHeight: 1 }}>
             {relationship ? `${relationship.compatibilityScore}%` : 'N/A'}
           </div>
           <div style={{ fontSize: '1.2rem', color: '#cc0000', marginTop: '8px', fontWeight: 'bold' }}>
             {relationship && relationship.compatibilityScore > 85 ? 'HIGH COMPATIBILITY' : relationship && relationship.compatibilityScore > 60 ? 'MODERATE COMPATIBILITY' : 'LOW COMPATIBILITY'}
           </div>
        </div>

        <table style={{ width: '90%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '1rem', backgroundColor: '#fff', position: 'relative', zIndex: 1 }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)', width: '30%' }}>Relationship Risk</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: relationship && relationship.riskLevel === 'LOW' ? 'var(--status-green)' : 'var(--status-warning)' }}>{relationship ? relationship.riskLevel : 'UNKNOWN'}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Assessment Factors</td>
              <td style={{ padding: '12px' }}>
                Traditional Pairing, Taste Chemistry, Texture Alignment, Pairing Frequency, Relationship Stability, Partner History.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="document-content document-border">
      <div className="watermark">PAZAMAYI SHERIYAYI</div>
      <DocumentHeader title={title} />
      
      <div style={{ minHeight: '400px' }}>
        {bodyContent}
      </div>

      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div className="seal-area" style={{ border: 'none', padding: 0, width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden' }}>
           <img src="/seal.png" alt="Official Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
         </div>
         <div style={{ textAlign: 'center', width: '250px' }}>
           <div style={{ borderBottom: '1px solid var(--text-dark)', marginBottom: '8px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <img src="/signature.png" alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
           </div>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>Authorized Signature</div>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{isCompatibility ? 'Compatibility Division' : 'Documentation Division'}</div>
         </div>
      </div>

      <DocumentFooter documentNumber={document.documentNumber} qrReference={document.qrReference} />
    </div>
  );
}
