'use client'
import Head from 'next/head'
import ClipLoader from 'react-spinners/ClipLoader'
import styles from 'components/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { ShortPlaylist } from 'types/index'

import { useSession } from 'next-auth/react'
import { signIn, signOut } from 'next-auth/react'
import { useThemeColor } from 'utils/theme'
import { AlertBanner } from 'components/components/AlertBanner'

const SPOTIFY_WEB_APP = 'http://open.spotify.com'

const emptyPlaylistState = {
  loading: false,
  errorMessage: '',
  noData: false,
}

export default function Home() {
  const [inputFields, setInputFields] = useState(['', ''])
  const [crossPlaylist, setCrossPlaylist] = useState<ShortPlaylist[]>([])
  const [playlistState, setPlaylistState] = useState<{
    loading: boolean
    errorMessage: string
    noData: boolean
  }>(emptyPlaylistState)

  const [isTokenExpired, setTokenExpired] = useState(false)

  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const loaderColor = useThemeColor('--sub-text')

  const showResetButton =
    inputFields.length > 2 || inputFields.some((field) => field.length)

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
    setPlaylistState({ ...emptyPlaylistState, loading: true })
    const res = await fetch(`/api/playlists/cross?p=${inputFields.join(',')}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const response = await res.json()
      setCrossPlaylist(response)
      setPlaylistState({
        ...emptyPlaylistState,
        noData: response.length === 0,
      })
    } else {
      reset()
      if (res.status === 401) {
        setTokenExpired(true)
        return
      }
      setPlaylistState({ ...emptyPlaylistState, errorMessage: 'Bad Request' })
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTokenExpired) {
      timer = setTimeout(() => {
        reset()
        signOut()
      }, 4000)
    }
    return () => clearTimeout(timer)
  }, [isTokenExpired])

  return (
    <>
      <Head>
        <title>
          Cross Playlist – Spotify Playlist Overlap Finder | @stplva
        </title>
        <meta
          name="description"
          content="Easily compare Spotify playlists and find the songs they have in common. Perfect for creating shared playlists or finding your music overlap!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} ${
          session ? 'justify-start' : 'justify-between'
        }`}
      >
        <div className="flex flex-col">
          <h1 className={`pb-8 ${styles.title}`}>Cross Playlist</h1>

          {isTokenExpired && (
            <AlertBanner
              title="Token expired!"
              text="You will be logged out in 4 seconds..."
              className="mb-8"
            />
          )}

          {playlistState.errorMessage && (
            <AlertBanner
              title="Error:"
              text={playlistState.errorMessage}
              className="mb-8"
            />
          )}

          <p className="pb-3">
            Welcome to your go-to playlist intersection tool! Whether you're
            looking to find shared tracks between your Spotify playlists or
            discover common songs with friends, we've got you covered.
          </p>
          <p>
            Getting started is simple: just copy the links to your playlists,
            paste them into inputs below, and let the app work its magic. In
            seconds, you'll see all the overlapping tracks neatly displayed.
            Happy crossifying ✨
          </p>

          {isLoading && (
            <div className="flex justify-center">
              <ClipLoader loading={isLoading} size={65} color={loaderColor} />
            </div>
          )}

          {!isLoading && session && (
            <div className="flex justify-between w-full gap-8 pt-8">
              <div className="flex gap-2 flex-1">
                <p>
                  Signed in as{' '}
                  <span className="font-bold">{session?.user?.name}</span>
                </p>
                <p
                  className="opacity-70 underline cursor-pointer"
                  onClick={() => signOut()}
                >
                  Sign Out
                </p>
              </div>
              {!playlistState.loading && crossPlaylist?.length > 0 && (
                <div className="flex-1">
                  <h3 className="font-bold">The common tracks are:</h3>
                </div>
              )}
            </div>
          )}

          {!isLoading && !session && (
            <div className="flex flex-col items-center w-full gap-6 pt-8">
              <p className="text-base">
                You need to be signed in to use this app!
              </p>
              <button
                className={`${styles.buttonGlow} px-12 py-5 rounded-xl bg-white text-black text-xl`}
                onClick={() => signIn()}
              >
                Sign in
              </button>
            </div>
          )}
        </div>

        {!isLoading && session && (
          <div className={styles.content}>
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
                        autoComplete="playlist-id"
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
                    !session ||
                    playlistState.loading ||
                    inputFields.some((field) => !field)
                  }
                >
                  Crossify!
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
              </div>
            </form>

            <div>
              {!playlistState.loading && crossPlaylist?.length > 0 && (
                <ul>
                  {crossPlaylist.map((track) => (
                    <li key={track.id} className="pb-2">
                      <a
                        href={`${SPOTIFY_WEB_APP}/track/${track.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {track.artists.map((a) => a.name).join(', ')} -{' '}
                        {track.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {playlistState.noData && <p>No common tracks here :(</p>}
              {playlistState.loading && (
                <ClipLoader
                  loading={playlistState.loading}
                  size={65}
                  color={loaderColor}
                />
              )}
            </div>
          </div>
        )}

        <div>
          <span>Created by </span>
          <a
            href="https://github.com/stplva"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            @stplva
          </a>
        </div>
      </main>
    </>
  )
}
