'use client'

import './globals.css'
import Script from 'next/script'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { fontSans } from '@/lib/fonts'
import { SiteHeader } from '@/components/site-header'
import WalletProvider from '@/components/wallet-provider'
import { Providers } from '@/redux/provider'
import '@rainbow-me/rainbowkit/styles.css'
import { Toaster } from '@/components/ui/toaster'

import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import {
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet, rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const appName = 'upto3'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName, chains }),
      walletConnectWallet({ projectId, chains }),
      rainbowWallet({projectId,chains})
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      imTokenWallet({ projectId, chains }),
      okxWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
    <head>
      <title>{siteConfig.name}</title>
      <meta name='description' content={siteConfig.description} />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: light)'
        content='white'
      />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: dark)'
        content='black'
      />
      <link rel='shortcut icon' href='favicon.ico' type='image/x-icon' />
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-3V11MDT7KM'
      />
      <Script id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-3V11MDT7KM');
        `}
      </Script>
    </head>
    <body className={cn('min-h-screen bg-background font-sans antialiased')}>
    <Providers>
      <WagmiConfig config={wagmiConfig}>
        <WalletProvider>
          <div className={`relative flex h-screen flex-col ${fontSans.className}`}>
            <SiteHeader />
            <main className='flex-1'>{children}</main>
          </div>
        </WalletProvider>
      </WagmiConfig>
    </Providers>
    <Toaster />
    </body>
    </html>
  )
}
