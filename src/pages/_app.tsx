import 'components/styles/globals.css'
import type { AppProps } from 'next/app'
import AuthProvider from './AuthProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </main>
  )
}
