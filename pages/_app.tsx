import "../styles/index.css";
import { ThemeProvider } from 'next-themes';
import Head from "next/head";
import { Header, Footer } from '../components/layout';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

export default function App({
  Component, 
  pageProps: {session, ...pageProps}
} : AppProps) {
  return (
    <ThemeProvider forcedTheme={Component.theme || undefined} enableSystem={true} attribute="class">
      <Head>
        <title>Toddlerfaces</title>
        <meta name="description" content="Private-by-default child photo albums for parents and photographers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.11),transparent_30rem),radial-gradient(circle_at_top_right,rgba(56,189,248,0.11),transparent_28rem),linear-gradient(180deg,#fffaf4_0%,#f8fafc_42%,#ffffff_100%)] text-gray-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.10),transparent_30rem),radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_28rem),linear-gradient(180deg,#020617_0%,#0f172a_48%,#030712_100%)] dark:text-gray-100">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      </SessionProvider>
    </ThemeProvider>
  )
}
