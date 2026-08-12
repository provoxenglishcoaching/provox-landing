import type { Metadata } from 'next';
import { Montserrat, Nunito_Sans } from 'next/font/google';
import '../globals.css';
import './portal.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--next-montserrat',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--next-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ProVox Portal',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${nunitoSans.variable}`}>
      <body className="portal-body" style={{ WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
