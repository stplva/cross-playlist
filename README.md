# Cross Playlist Spotify 2.0

This is a new version of [Spotify Cross Playlist](https://github.com/stplva/crossable-spotify-playlist) projet, rebuilt with Next.js and better practices!

Auth is handled by next-auth and Spotify Provider.

## Development

1. Clone this git repo: `git clone git@github.com:stplva/cross-playlist.git && cd cross-playlist`.
2. Install dependencies `npm install`.
3. Set up environment variables: `cp .env.example .env.local`. Check your [Spotify dahboard](https://developer.spotify.com/dashboard).
4. If you wish to deploy your application, you MUST provide 2 more env variables. Execute this command to generate a `hash_key`:

```bash
openssl rand -base64 32
```

5. Start application: `npm run dev`.
6. Go to `http://localhost:3000`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
