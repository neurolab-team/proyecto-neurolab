import { AppProps } from "next/app";
import Head from "next/head";
import { Providers } from "../providers";
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to proyecto-siga-frontend!</title>
      </Head>
      <main className="app">
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </main>
    </>
  );
}

export default CustomApp;
