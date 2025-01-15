import NextAuth from 'next-auth/next'
import { type NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-email',
  'user-library-read',
].join(',')

// async function refreshAccessToken(token: any) {
//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//       Authorization:
//         'Basic ' +
//         new Buffer.from(
//           process.env.SPOTIFY_CLIENT_ID +
//             ':' +
//             process.env.SPOTIFY_CLIENT_SECRET
//         ).toString('base64'),
//     },
//     body: new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: token.refreshToken,
//       client_id: process.env.SPOTIFY_CLIENT_ID,
//     }),
//   })

//   const data = await response.json()

//   console.log('DATA FOR TOKEN = ', data)

//   return {
//     accessToken: data.access_token,
//     refreshToken: data.refresh_token ?? token.refreshToken,
//     accessTokenExpires: Date.now() + data.expires_in * 1000,
//   }
// }

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
      }
      return token
      // if (Date.now() < token.accessTokenExpires * 1000) {
      //   return token
      // }

      // return refreshAccessToken(token)
    },
    async session({ session, token }) {
      return {
        ...session,
        token,
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
