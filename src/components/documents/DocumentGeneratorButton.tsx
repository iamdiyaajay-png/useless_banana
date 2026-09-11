'use client';

import React, { useState } from 'react';
import { generateDocument } from '@/app/actions/documents';
import { useRouter } from 'next/navigation';

export function DocumentGeneratorButton({ bananaId, documentType, hasExisting, label }: { bananaId: string, documentType: any, hasExisting: boolean, label?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateDocument(bananaId, documentType);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleGenerate}
      disabled={loading}
      style={{ 
        padding: '8px 16px', 
        backgroundColor: 'var(--gov-blue)', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        fontWeight: 'bold', 
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'GENERATING...' : label ? label : hasExisting ? 'REGENERATE' : 'GENERATE'}
    </button>
  );
}
