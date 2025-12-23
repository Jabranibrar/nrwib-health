import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const hostURL = process.env.NEXT_PUBLIC_NEXTJS_HOST_URL ?? 'nrwib-health.3lanemarketing.com';
    return (
      <Html lang="en">
        <Head></Head>
        <body suppressHydrationWarning>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
