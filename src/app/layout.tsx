import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mr. Black — The Desi Undercover & Mr. White Social Deduction Party Game',
  description:
    'Play Mr. Black (Mr. White / Undercover) party game online with a desi Indian twist! Pass-and-play with friends across Bollywood, Desi Food, Cricket & Memes. Spot the Undercover and unmask Mr. Black.',
  keywords: [
    'undercover',
    'mr white',
    'mr white party game',
    'mr white online game',
    'mr black',
    'mr black party game',
    'mr black online game',
    'mr black indian game',
    'mr white indian game',
    'undercover game online',
    'desi party game',
    'indian party game',
    'pass and play party game',
    'social deduction game online',
    'bollywood party game',
  ],
  authors: [{ name: 'Mr. Black Community' }],
  creator: 'Mr. Black',
  publisher: 'Mr. Black',
  metadataBase: new URL('https://playmrblack.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mr. Black — Desi Undercover & Mr. White Party Game',
    description: 'Pass-and-play party game with Bollywood, Cricket, Street Food & Desi vibes. Unmask Mr. Black or bluff your way to victory!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mr. Black',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. Black — The Desi Undercover & Mr. White Party Game',
    description: 'Play Mr. Black & Undercover online with friends. Pass and play party game with an Indian twist!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-discord-mesh selection:bg-discord-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
