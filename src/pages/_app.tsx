import 'components/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import AuthProvider from './AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </main>
  )
}
