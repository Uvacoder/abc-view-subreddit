import {AppProps} from 'next/app'
import {MantineProvider, ColorSchemeProvider, ColorScheme} from '@mantine/core'
import {useHotkeys, useLocalStorage} from '@mantine/hooks'
import Head from 'next/head'
import config from '~/lib/config'
import {SessionProvider} from 'next-auth/react'

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: {session, ...pageProps}
  } = props
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'riv-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <title>{config?.siteTitle}</title>
        <meta name="description" content={config?.siteDescription} />

        <link
          rel="preconnect"
          href="//oauth.reddit.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="//i.redd.it" crossOrigin="anonymous" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon/icon.png" />
        <link rel="icon" href="/favicon/icon.png" sizes="192x192" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={config?.siteUrl} />
        <meta property="og:title" content={config?.siteTitle} />
        <meta property="og:description" content={config?.siteDescription} />
        <meta
          property="og:image"
          content={`${config?.siteUrl}social-share.jpg`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={config?.siteUrl} />
        <meta property="twitter:title" content={config?.siteTitle} />
        <meta
          property="twitter:description"
          content={config?.siteDescription}
        />
        <meta
          property="twitter:image"
          content={`${config?.siteUrl}social-share.jpg`}
        />

        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      </Head>
      <SessionProvider session={session}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{colorScheme}}
            withGlobalStyles
            withNormalizeCSS
          >
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  )
}