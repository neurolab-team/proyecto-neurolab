import { AppProps } from "next/app";
import Head from "next/head";
import { QueryClientProviderWrapper } from "../providers/queryProvider";
import { AuthProvider } from "../providers/authProvider";
import { ModalProvider } from "../providers/modalProvider";
import { ToastProvider } from "../providers/toastProvider";
import "./styles.css";
import AuthGuard from "../components/Auth/AuthGuard";
import ModalRoot from "../components/modal/core/ModalRoot";

type AppPropsWithAuth = AppProps & {
  Component: {
    auth?: boolean | string | string[];
  };
};
function CustomApp({ Component, pageProps }: AppPropsWithAuth) {
  const authConfig = Component.auth;
  return (
    <>
      <Head>
        <title>Welcome to proyecto-siga-frontend!</title>
      </Head>
      <main className="app">
        <QueryClientProviderWrapper>
          <AuthProvider>
            <ModalProvider>
              <>
                {authConfig ? (
                  <AuthGuard auth={authConfig}>
                    {<Component {...pageProps} />}
                  </AuthGuard>
                ) : (
                  <Component {...pageProps} />
                )}
                <ModalRoot />
                <ToastProvider />
              </>
            </ModalProvider>
          </AuthProvider>
        </QueryClientProviderWrapper>
      </main>
    </>
  );
}

export default CustomApp;
