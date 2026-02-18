import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Support Imajin | Buy Me a Coffee',
  description: 'Support the building of sovereign infrastructure for identity, payments, and presence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
