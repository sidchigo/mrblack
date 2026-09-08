import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mr. Black Game Online — Free Desi Undercover & Mr. White Party Game',
  description:
    'Play Mr. Black (Mr. White / Undercover) party game online free with a desi Indian twist! Pass-and-play on 1 phone with friends across Bollywood, Desi Food, Cricket & Memes. No app, no signup, 100% offline ready.',
  manifest: '/manifest.json',
  themeColor: '#1e2353',
  keywords: [
    'mr white',
    'mr white game',
    'mr white online',
    'mr white party game',
    'mr white game online',
    'mr white free',
    'undercover',
    'undercover game',
    'undercover party game',
    'undercover game online',
    'undercover game online free',
    'undercover game words list',
    'undercover word pairs',
    'mr black',
    'mr black game',
    'mr black online',
    'mr black party game',
    'mr black online game',
    'mr black indian game',
    'mr white indian game',
    'desi party game',
    'indian party game',
    'pass and play party game',
    'social deduction game online',
    'bollywood party game',
    'offline party game',
    'free party games to play with friends',
    'one phone party games',
  ],
  authors: [{ name: 'Mr. Black Community' }],
  creator: 'Mr. Black',
  publisher: 'Mr. Black',
  metadataBase: new URL('https://playmrblack.vercel.app'),
  alternates: {
    canonical: 'https://playmrblack.vercel.app',
  },
  openGraph: {
    title: 'Mr. Black Game Online — Desi Undercover & Mr. White Party Game',
    description: 'Play Mr. Black & Undercover online free. Pass-and-play party game with Bollywood, Cricket, Street Food & Desi vibes. Unmask Mr. Black or bluff your way to victory! No app, no signup.',
    url: 'https://playmrblack.vercel.app',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mr. Black',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. Black — Free Desi Undercover & Mr. White Party Game',
    description: 'Play Mr. Black & Undercover online with friends. Pass and play party game on 1 phone with an Indian twist! No signup, no download.',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Mr. Black Online Game',
    url: 'https://playmrblack.vercel.app',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free social deduction party game for friends. Play Mr. Black, Undercover, and Mr. White online in your browser. Pass one phone around, no app, no signup, works offline.',
    genre: ['Party Game', 'Social Deduction', 'Word Game', 'Desi Game', 'Pass and Play'],
    inLanguage: 'en',
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-discord-mesh selection:bg-discord-primary selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
