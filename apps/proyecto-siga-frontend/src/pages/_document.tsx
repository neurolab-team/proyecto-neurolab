import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  override render() {
    return (
      <Html lang="es">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
