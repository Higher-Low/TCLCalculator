import Head from 'next/head'

export default function Layout({ children, title = 'Trading Calculator' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Advanced trading position calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <header className="header">
          <h1>Trading Position Calculator</h1>
        </header>

        <main className="main">
          {children}
        </main>

        <footer className="footer">
          <p>&copy; 2024 Trading Calculator. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
