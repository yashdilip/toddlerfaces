import "../styles/index.scss";
import { ThemeProvider } from 'next-themes';
import Head from "next/head";
import { Header, Footer } from '../components/layout';
import { AppProps} from 'next/app';

export default function App({ Component, pageProps } : AppProps) {
  return (
    <div className="container mx-auto my-10">
      <ThemeProvider forcedTheme={Component.theme || undefined} enableSystem={true} attribute="class">
        <Head>
          <title>toddlerface</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main>
          <Header />

          <Component {...pageProps} />

          <Footer />
        </main>
      </ThemeProvider>
    </div>
  )
}
