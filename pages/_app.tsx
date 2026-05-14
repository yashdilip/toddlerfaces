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
        <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-black dark:text-gray-100">
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
