'use client';

import React from 'react';
import { logDocumentPrint } from '@/app/actions/documents';

export function PrintAction({ bananaId, documentType }: { bananaId: string, documentType: string }) {
  
  const handlePrint = async () => {
    await logDocumentPrint(bananaId, documentType);
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      style={{ padding: '12px 24px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
    >
      DOWNLOAD PDF / PRINT 🖨️
    </button>
  );
}
