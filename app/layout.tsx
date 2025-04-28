import type { Metadata } from 'next';
import './globals.css';

export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'University Attendance System',
  description: 'A comprehensive attendance management system for universities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 