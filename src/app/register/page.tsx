export const dynamic = 'force-dynamic';
import React from 'react';
import { RegistrationForm } from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>NEW BANANA REGISTRATION</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Submit a specimen for registration in the Pazamayi Sheriyayi.
        </p>
      </div>

      <RegistrationForm />
    </div>
  );
}
