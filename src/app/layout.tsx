import type { Metadata } from 'next';
import './globals.css';
import { GovernmentHeader } from '@/components/ui/GovernmentHeader';
import { Sidebar } from '@/components/ui/Sidebar';

export const metadata: Metadata = {
  title: 'Pazamayi Sheriyayi',
  description: 'Official Government Portal for the Registration and Analysis of Bananas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GovernmentHeader />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--ivory)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
