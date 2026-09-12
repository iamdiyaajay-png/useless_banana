import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeader';

export function ReportTemplate({ type, banana, document }: { type: 'PHYSICAL' | 'VARIETY', banana: any, document: any }) {
  
  let title = '';
  let bodyContent = null;
  
  // Grab the latest analysis if available
  const analysis = banana.analyses.length > 0 ? banana.analyses[0] : null;

  if (type === 'PHYSICAL') {
    title = 'PHYSICAL ANALYSIS REPORT';
    bodyContent = (
      <>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
           <div style={{ width: '200px', height: '200px', border: '2px solid var(--gov-blue)', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px' }}>
              {analysis && analysis.imageReference ? (
                <img src={analysis.imageReference} alt="Specimen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : banana.photo ? (
                <img src={banana.photo} alt="Specimen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#999', fontSize: '0.8rem' }}>NO IMAGE PROVIDED</span>
              )}
           </div>
           <div style={{ flex: 1 }}>
             <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--gov-blue)' }}>SPECIMEN DETAILS</h3>
             <table style={{ width: '100%', textAlign: 'left', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
               <tbody>
                 <tr><th style={{ padding: '4px 0', width: '40%' }}>Banana ID:</th><td>{banana.id}</td></tr>
                 <tr><th style={{ padding: '4px 0' }}>Official Name:</th><td>{banana.officialName}</td></tr>
                 <tr><th style={{ padding: '4px 0' }}>Analysis ID:</th><td>{analysis ? analysis.id : 'N/A'}</td></tr>
                 <tr><th style={{ padding: '4px 0' }}>Analysis Date:</th><td>{analysis ? new Date(analysis.timestamp).toLocaleDateString() : 'N/A'}</td></tr>
                 <tr><th style={{ padding: '4px 0' }}>Method:</th><td style={{ color: 'var(--status-warning)', fontWeight: 'bold' }}>{analysis ? analysis.analysisMethod : 'N/A'}</td></tr>
               </tbody>
             </table>
           </div>
        </div>

        <h3 style={{ margin: '0 0 16px 0', borderBottom: '2px solid var(--gov-blue)', paddingBottom: '8px', color: 'var(--gov-blue)' }}>MEASURED HEURISTICS</h3>
        {analysis ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--gov-blue-light)', borderBottom: '2px solid var(--gov-blue)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Parameter</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Assessment Type</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Curvature Angle</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '1.2rem' }}>{analysis.curvature}%</td>
                <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>IMAGE-DERIVED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Straightness Index</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '1.2rem' }}>{analysis.straightnessIndex}%</td>
                <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>IMAGE-DERIVED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Color Ripeness</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '1.2rem' }}>{analysis.ripeness}%</td>
                <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>HEURISTIC</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Detection Confidence</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '1.2rem' }}>{analysis.detectionConfidence}%</td>
                <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-light)' }}>AI-ASSISTED</td>
              </tr>
            </tbody>
          </table>
        ) : (
           <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>ANALYSIS PENDING</div>
        )}
      </>
    );
  } else if (type === 'VARIETY') {
    title = 'VARIETY ASSESSMENT REPORT';
    bodyContent = (
      <>
        <div style={{ textAlign: 'center', margin: '40px 0', padding: '24px', backgroundColor: 'var(--gov-blue-light)', border: '2px solid var(--gov-blue)' }}>
           {banana.photo && (
             <div style={{ width: '100px', height: '120px', border: '2px solid var(--gov-blue)', padding: '4px', backgroundColor: '#fff', margin: '0 auto 16px auto' }}>
               <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
           )}
           <div style={{ fontSize: '1rem', color: 'var(--gov-blue)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>AI-ESTIMATED VARIETY</div>
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gov-blue-dark)' }}>
             {banana.estimatedVariety || 'ASSESSMENT PENDING'}
           </div>
           {banana.varietyConfidence && (
             <div style={{ fontSize: '1rem', color: 'var(--status-green)', marginTop: '8px', fontWeight: 'bold' }}>
               CONFIDENCE: {banana.varietyConfidence}%
             </div>
           )}
        </div>

        <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Banana ID</td>
              <td style={{ padding: '12px', fontFamily: 'monospace' }}>{banana.id}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Scientific Classification</td>
              <td style={{ padding: '12px' }}>{banana.scientificClassification || 'Musa spp.'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Analysis Date</td>
              <td style={{ padding: '12px' }}>{analysis ? new Date(analysis.timestamp).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Methodology</td>
              <td style={{ padding: '12px', color: 'var(--status-warning)', fontWeight: 'bold' }}>AI-ASSISTED VISUAL ESTIMATION</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '40px', padding: '16px', border: '1px solid var(--border-color)', backgroundColor: '#fafafa', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
          <strong>IMPORTANT DISCLAIMER:</strong> This document represents an AI-assisted visual estimation based on heuristic features. It is not a certified botanical determination and cannot be used for legal agricultural classification.
        </div>
      </>
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
           <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Analysis Division</div>
         </div>
      </div>

      <DocumentFooter documentNumber={document.documentNumber} qrReference={document.qrReference} />
    </div>
  );
}
