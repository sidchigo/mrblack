import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mr. Black — The Ultimate Desi Social Deduction Party Game',
  description:
    'Pass-and-play party game with a spicy Indian twist. Find the Undercover and unmask Mr. Black before it’s too late!',
  keywords: ['party game', 'undercover', 'mr white', 'desi games', 'social deduction', 'pass and play'],
  openGraph: {
    title: 'Mr. Black — Desi Party Game',
    description: 'Find the Undercover & unmask Mr. Black! Play with friends on one phone.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-discord-mesh selection:bg-discord-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
