import "../styles/index.scss";
import { ThemeProvider } from 'next-themes';
import Head from "next/head";
import { Header, Footer } from '../components/layout';

export default function App({ Component, pageProps }) {
  return (
    <div className="container mx-auto my-10">
      <ThemeProvider enableSystem={true} attribute="class">
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
