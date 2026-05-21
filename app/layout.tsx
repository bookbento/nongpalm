import type { Metadata } from 'next';
import { Bodoni_Moda, Jost } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Furniture | NONGPALM',
  description:
    'Maison Harlowe — a luxury fashion house. Florentine atelier, est. 1962. Autumn / Winter 2026 lookbook.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${jost.variable}`}
    >
      <body className="bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
