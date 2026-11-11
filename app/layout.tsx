import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'الهامش — النص بداية الحوار', description: 'منصة ثقافية عربية مستقلة. نكتب النصوص، ونفتح للمعنى أكثر من باب.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
