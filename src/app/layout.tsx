import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

//theme
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        <meta name="theme-color" content="#2A323D" />
        <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        {children}
        <script async src="assets/bootstrap/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
