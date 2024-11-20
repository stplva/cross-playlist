import Head from 'next/head'
import ClipLoader from 'react-spinners/ClipLoader'
import styles from 'components/styles/Home.module.css'
import { useState } from 'react'
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

  const showResetButton = inputFields.some((field) => field.length)
  const showExample = playlistState.errorMessage.includes('400')

  const reset = () => {
    setInputFields(['', ''])
    setCrossPlaylist([])
    setPlaylistState(emptyPlaylistState)
  }

  const handleAddFields = (e: React.MouseEvent<HTMLButtonElement>) => {
    setInputFields([...inputFields, ''])
  }

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = [...inputFields]
    data[index] = e.target.value
    setInputFields(data)
  }

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pastedText = e.clipboardData?.getData('text') || ''
    const playlistUrlMatch =
      /^(https:\/\/open.spotify.com\/playlist\/)([a-zA-Z0-9]+)(.*)$/.exec(
        pastedText
      )

    const data = [...inputFields]
    if (playlistUrlMatch) {
      const playlistId = playlistUrlMatch[2]
      data[index] = playlistId
    } else {
      data[index] = pastedText
    }
    setInputFields(data)
    e.preventDefault() // to avoid calling onChange
  }

  const handleValidateOnBlur = (
    index: number,
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {}

  const handleFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    try {
      setPlaylistState({ ...emptyPlaylistState, loading: true })
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
        throw new Error('Bad Request')
      }
    } catch (e: any) {
      reset()
      setPlaylistState({ ...emptyPlaylistState, errorMessage: e.message })
    }
  }

  const handleUseExample = async (e: React.MouseEvent<HTMLButtonElement>) => {
    reset()
    setInputFields(exampleInputFields)
  }

  return (
    <>
      <Head>
        <title>Find Cross Playlist from Spotify | @stplva</title>
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
          <a
            href="https://github.com/stplva"
            target="_blank"
            rel="noopener noreferrer"
          >
            By @stplva
          </a>
        </div>

        <div className={styles.content}>
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
            <div className="flex flex-col gap-4">
              {inputFields.map((playlistId, index) => {
                return (
                  <div
                    className={`flex sm:flex-col items-center sm:items-start gap-4 sm:gap-1 ${styles.inputField}`}
                    key={`div-${index}`}
                  >
                    <input
                      className="block px-2 py-1.5 w-2/3 sm:w-full rounded-md bg-transparent border-2 font-light"
                      key={index}
                      type="text"
                      placeholder={`Playlist #${index + 1} id`}
                      name="playlistId"
                      value={playlistId}
                      onChange={(e) => handleChange(index, e)}
                      onPaste={(e) => handlePaste(index, e)}
                      onBlur={(e) => handleValidateOnBlur(index, e)}
                    />
                    {playlistId && (
                      <a
                        href={`https://open.spotify.com/playlist/${playlistId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open <span>-&gt;</span>
                      </a>
                    )}
                    {/* {() => fetchApi(`/playlist/${playlistId}`)} */}
                  </div>
                )
              })}
            </div>
            <button
              onClick={handleAddFields}
              type="button"
              className="primary px-2 mt-4 rounded-md font-bold"
            >
              +
            </button>
            <div className="flex mt-4 gap-4">
              <button
                type="submit"
                className="primary block px-4 py-2 rounded-md font-bold text-base"
                disabled={
                  playlistState.loading || inputFields.some((field) => !field)
                }
              >
                Find cross playlist!
              </button>
              {/* {!playlistState.loading &&
                crossPlaylist.length > MIN_TRACKS_TO_SAVE_PLAYLIST && (
                  <button
                    onClick={handleCreatePlaylist}
                    className="block px-4 py-2 rounded-md bg-teal font-bold text-base text-white"
                  >
                    Save this playlist!
                  </button>
                )} */}
              {showResetButton && (
                <button
                  onClick={reset}
                  type="button"
                  className="secondary block text-sm sm:text-base"
                >
                  Reset
                </button>
              )}
              {showExample && (
                <button
                  onClick={handleUseExample}
                  type="button"
                  className="secondary block px-4 py-2 text-sm sm:text-base"
                >
                  Try an example
                </button>
              )}
            </div>
          </form>

          <div className="">
            {!playlistState.loading && crossPlaylist?.length > 0 && (
              <ul className="overflow-scroll">
                {crossPlaylist.map((track) => {
                  return (
                    <li key={track.id}>
                      <a
                        href={`${SPOTIFY_WEB_APP}/track/${track.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {track.artists.map((a) => a.name).join(', ')} -{' '}
                        {track.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
            {playlistState.noData && <p>Nothing here :(</p>}
            {playlistState.loading && (
              <ClipLoader loading={playlistState.loading} size={65} />
            )}
          </div>
        </div>

        <div>
          {playlistState.errorMessage && <p>{playlistState.errorMessage}</p>}
        </div>
      </main>
    </>
  )
}
