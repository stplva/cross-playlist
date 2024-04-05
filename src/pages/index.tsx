import Head from 'next/head'
import ClipLoader from 'react-spinners/ClipLoader'
import styles from 'components/styles/Home.module.css'
import { FormEvent, useState } from 'react'
import { ShortPlaylist } from 'types/index'

const exampleInputFields = ['37i9dQZF1DWTJ7xPn4vNaz', '37i9dQZF1DWXRqgorJj26U']
const SPOTIFY_WEB_APP = 'http://open.spotify.com'

const emptyPlaylistState = {
  loading: false,
  errorMessage: '',
  noData: false,
}

export default function Home() {
  const [inputFields, setInputFields] = useState<string[]>(['', ''])
  const [crossPlaylist, setCrossPlaylist] = useState<ShortPlaylist[]>([])
  const [playlistState, setPlaylistState] = useState<{
    loading: boolean
    errorMessage: string
    noData: boolean
  }>(emptyPlaylistState)

  const useExample = playlistState.errorMessage.includes('400')

  const reset = () => {
    setInputFields(['', ''])
    setCrossPlaylist([])
    setPlaylistState(emptyPlaylistState)
  }

  const handleAddFields = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setInputFields([...inputFields, ''])
  }

  const handleFormChange = (index: number, e: any) => {
    let data = [...inputFields]
    data[index] = e.target.value
    setInputFields(data)
  }

  const handleFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    try {
      setPlaylistState({ ...playlistState, loading: true })
      const res = await fetch(
        `/api/playlists/cross?p=${inputFields.join(',')}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (res.ok) {
        const response = await res.json()
        setCrossPlaylist(response)
        setPlaylistState({
          ...emptyPlaylistState,
          noData: response.length === 0,
        })
      } else {
        console.log('res', res)
      }
    } catch (e: any) {
      reset()
      setPlaylistState({ ...playlistState, errorMessage: e.message })
    }
  }

  const handleUseExample = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    reset()
    setInputFields(exampleInputFields)
  }

  return (
    <>
      <Head>
        <title>Cross Playlist | @stplva</title>
        <meta
          name="description"
          content="Find a cross playlist of 2 or more Spotify playlists."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <h1>Cross Playlist</h1>
          <div>
            <a
              href="https://github.com/stplva"
              target="_blank"
              rel="noopener noreferrer"
            >
              By @stplva
            </a>
          </div>
        </div>

        <div className={styles.center}>
          {/* <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form> */}

          <form onSubmit={handleFormSubmit}>
            {inputFields.map((playlistId, index) => {
              return (
                <div
                  className="flex content-center mb-2 gap-4"
                  key={`div-${index}`}
                >
                  <input
                    className="block px-2 py-1 w-64 rounded bg-transparent border border-white placeholder:text-black font-light"
                    key={index}
                    type="text"
                    placeholder={`Playlist ${index + 1} id`}
                    name="playlistId"
                    value={playlistId}
                    onChange={(e) => handleFormChange(index, e)}
                  ></input>
                  {playlistId && (
                    <a
                      href={`https://open.spotify.com/playlist/${playlistId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      open playlist
                    </a>
                  )}
                  {/* {() => fetchApi(`/playlist/${playlistId}`)} */}
                </div>
              )
            })}
            <button onClick={handleAddFields} className="px-2 rounded bg-white">
              +
            </button>
            <div className="flex mt-4 gap-4">
              <button
                onClick={handleFormSubmit}
                className="block px-4 py-2 rounded-md bg-light-blue font-bold text-md text-red"
              >
                Cross find!
              </button>
              {/* {!playlistState.loading &&
                crossPlaylist.length > MIN_TRACKS_TO_SAVE_PLAYLIST && (
                  <button
                    onClick={handleCreatePlaylist}
                    className="block px-4 py-2 rounded-md bg-teal font-bold text-md text-white"
                  >
                    Save this playlist!
                  </button>
                )} */}
              {useExample && (
                <button
                  onClick={handleUseExample}
                  className="block px-4 py-2 bg-transparent text-sm"
                >
                  Try an example
                </button>
              )}
            </div>
          </form>

          <div className="mt-8">
            <ul className="overflow-scroll scrollable-ul">
              {!playlistState.loading &&
                crossPlaylist?.length > 0 &&
                crossPlaylist.map((track) => {
                  return (
                    <li key={track.id}>
                      <a
                        href={`${SPOTIFY_WEB_APP}/track/${track.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {track.artists.map((a) => a.name).join(',')} -{' '}
                        {track.name}
                      </a>
                    </li>
                  )
                })}
              {playlistState.noData && <p>Nothing here :(</p>}
              {playlistState.loading && (
                <ClipLoader loading={playlistState.loading} size={65} />
              )}
            </ul>
          </div>
          {playlistState.errorMessage && <p>{playlistState.errorMessage}</p>}
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
