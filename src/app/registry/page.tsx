import React from 'react';
import RegistryArchive from '@/components/RegistryArchive';

export const metadata = {
  title: 'Registry Archive - National Banana Registry',
};

export default function RegistryPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Registry Archive</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Search and filter the complete database of officially registered specimens.
        </p>
      </div>
      
      <RegistryArchive />
    </div>
  );
}
