'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerBanana } from '@/app/actions/register';
import { OfficialCard } from '@/components/ui/OfficialCard';

export function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('REG-ERR-1002: Invalid file type. Please upload a valid image.');
        setPreview(null);
        return;
      }
      setError(null);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerBanana(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.id) {
      router.push(`/register/success?id=${result.id}`);
    }
  };

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-dark)' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '20px', fontSize: '1rem' };

  return (
    <OfficialCard title="Subject Details">
      {error && (
        <div style={{ backgroundColor: 'var(--status-red-light)', color: 'var(--status-red)', padding: '16px', borderRadius: '4px', marginBottom: '24px', border: '1px solid var(--status-red)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Official Banana Name <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input style={inputStyle} type="text" name="officialName" required placeholder="Enter the official scientific or regional name" />
        </div>

        <div>
          <label style={labelStyle}>Origin <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input style={inputStyle} type="text" name="origin" required placeholder="State, Region, or Country of Origin" />
        </div>

        <div>
          <label style={labelStyle}>Nickname (Optional)</label>
          <input style={inputStyle} type="text" name="nickname" placeholder="Common name or local designation" />
        </div>

        <div>
          <label style={labelStyle}>Banana Photo <span style={{ color: 'var(--status-red)' }}>*</span></label>
          <input style={{...inputStyle, border: 'none', padding: 0}} type="file" name="photo" accept="image/*" required onChange={handleImageChange} />
          
          {preview && (
            <div style={{ marginTop: '12px', marginBottom: '20px', border: '1px dashed var(--muted-gold)', padding: '12px', display: 'inline-block' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '8px' }}>Image loaded successfully.</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: 'var(--gov-blue)',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'PROCESSING REGISTRATION...' : 'SUBMIT FOR REGISTRATION'}
          </button>
        </div>
      </form>
    </OfficialCard>
  );
}
