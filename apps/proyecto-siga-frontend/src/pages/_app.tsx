import { AppProps } from "next/app";
import Head from "next/head";
import { QueryClientProviderWrapper } from "../providers/queryProvider";
import { AuthProvider } from "../providers/authProvider";
import "./styles.css";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to proyecto-siga-frontend!</title>
      </Head>
      <main className="app">
        <QueryClientProviderWrapper>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </QueryClientProviderWrapper>
      </main>
    </>
  );
}

export default CustomApp;
