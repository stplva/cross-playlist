import { NextRequest } from 'next/server'
import axios from 'axios'
import { getArraysIntersection } from 'utils/index'
import { Playlist, ShortPlaylist, Track } from 'types/index'
import { createLogger } from 'utils/logger'
import { getToken } from 'next-auth/jwt'

const logger = createLogger('lib/playlists')

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const SPOTIFY_DOMAIN_URL = 'https://accounts.spotify.com'

const SPOTIFY_ENDPOINTS = {
  authorize: `${SPOTIFY_DOMAIN_URL}/authorize`,
  token: `${SPOTIFY_DOMAIN_URL}/api/token`,
  playlists: `${SPOTIFY_API_URL}/playlists`,
}

export const getPlaylistById = async (req: NextRequest, playlistId: string) => {
  logger.info(`Getting playlist by id ${playlistId}`)
  const token = await getToken({ req })
  const accessToken = token?.accessToken
  try {
    const res = await axios
      .get(`${SPOTIFY_ENDPOINTS.playlists}/${playlistId}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
    // .catch((e) => {
    //   throw e
    // })

    return res as Playlist
  } catch (e: any) {
    const error = e.response?.data || e.message
    logger.error(`getPlaylistById Error: ${JSON.stringify(error)}`)
    throw e
  }
}

export const findCrossPlaylist = async (
  req: NextRequest,
  playlistIds: string[]
): Promise<ShortPlaylist[]> => {
  logger.info(`Finding a cross-playlist for playlists ${playlistIds}`)

  let playlists: (Playlist | null)[] = []
  playlists = await Promise.all(
    playlistIds.map(async (id) => {
      const playlist = await getPlaylistById(req, id)
      return playlist
    })
  )

  const tracks: ShortPlaylist[][] = playlists?.map((playlist: any) => {
    return playlist?.tracks?.items.map((item: { track: Track }) => {
      return {
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a) => ({ id: a.id, name: a.name })),
      }
    })
  })

  if (tracks.some((arr) => arr.length === 0)) {
    logger.error(`One or all of the playlists are empty.`)
    return []
  }

  const flatTracks = tracks.flat()
  const ids = tracks.map((arr) => arr.map((t) => t.id))
  const crossIds = getArraysIntersection(ids)

  if (crossIds.length === 0) {
    logger.warn(`No tracks that match all of the playlists found :(`)
    return []
  }

  const crossPlaylist: ShortPlaylist[] = crossIds.map((id) => ({
    id,
    name: flatTracks.find((t) => t.id === id)?.name || '',
    artists: flatTracks.find((t) => t.id === id)?.artists || [],
  }))

  logger.info(
    `Success! Found ${crossPlaylist.length} tracks for the Cross Playlist`
  )
  return crossPlaylist
}
