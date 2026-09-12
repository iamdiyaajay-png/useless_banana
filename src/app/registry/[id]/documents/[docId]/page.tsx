import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintAction } from '@/components/documents/PrintAction';
import { BanadhaarTemplate } from '@/components/documents/BanadhaarTemplate';
import { CertificateTemplate } from '@/components/documents/CertificateTemplate';
import { ReportTemplate } from '@/components/documents/ReportTemplate';

export const revalidate = 0;

export default async function DocumentViewerPage({ params }: { params: Promise<{ id: string, docId: string }> }) {
  const { id, docId } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id },
    include: {
      analyses: { orderBy: { timestamp: 'desc' } },
      relationships: { include: { foodPartner: true } },
      documents: true
    }
  });
  
  if (!banana) return notFound();

  const document = banana.documents.find(d => d.id === docId);
  if (!document) return notFound();

  // Determine what to render
  let TemplateContent;
  switch (document.documentType) {
    case 'BANADHAAR':
      TemplateContent = <BanadhaarTemplate banana={banana} document={document} />;
      break;
    case 'REGISTRATION_CERT':
      TemplateContent = <CertificateTemplate type="REGISTRATION" banana={banana} document={document} />;
      break;
    case 'BIRTH_CERT':
      TemplateContent = <CertificateTemplate type="BIRTH" banana={banana} document={document} />;
      break;
    case 'PHYSICAL_REPORT':
      TemplateContent = <ReportTemplate type="PHYSICAL" banana={banana} document={document} />;
      break;
    case 'VARIETY_REPORT':
      TemplateContent = <ReportTemplate type="VARIETY" banana={banana} document={document} />;
      break;
    case 'COMPATIBILITY_CERT':
      TemplateContent = <CertificateTemplate type="COMPATIBILITY" banana={banana} document={document} />;
      break;
    case 'COMPLETE_FILE':
      TemplateContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* We render all of them stacked for the complete file */}
          <div className="page-break" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--gov-blue)' }}>PAZAMAYI SHERIYAYI</h1>
            <h2 style={{ fontSize: '2rem', letterSpacing: '2px' }}>COMPLETE BANANA RECORD</h2>
            <div style={{ marginTop: '40px', fontSize: '1.2rem', textAlign: 'left', border: '2px solid var(--border-color)', padding: '24px' }}>
              <p><strong>Banana:</strong> {banana.officialName}</p>
              <p><strong>Banana ID:</strong> {banana.id}</p>
              <p><strong>File Reference:</strong> {document.documentNumber}</p>
              <p><strong>Status:</strong> {document.status}</p>
            </div>
          </div>
          <div className="page-break"><BanadhaarTemplate banana={banana} document={document} /></div>
          <div className="page-break"><CertificateTemplate type="REGISTRATION" banana={banana} document={document} /></div>
          <div className="page-break"><CertificateTemplate type="BIRTH" banana={banana} document={document} /></div>
          <div className="page-break"><ReportTemplate type="VARIETY" banana={banana} document={document} /></div>
          <div className="page-break"><ReportTemplate type="PHYSICAL" banana={banana} document={document} /></div>
          {banana.relationships.length > 0 && <div className="page-break"><CertificateTemplate type="COMPATIBILITY" banana={banana} document={document} /></div>}
        </div>
      );
      break;
    default:
      TemplateContent = <div>Template not implemented.</div>;
  }

  return (
    <div>
      <div className="hide-on-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: '#fff', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
        <div>
          <Link href={`/registry/${id}/documents`} style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Vault
          </Link>
          <div style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>Viewing: {document.documentNumber}</div>
        </div>
        <div>
          <PrintAction bananaId={id} documentType={document.documentType} />
        </div>
      </div>

      <div className="document-container" style={{ margin: '0 auto', maxWidth: '800px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '0', minHeight: '1000px', position: 'relative' }}>
        {TemplateContent}
      </div>
    </div>
  );
}
