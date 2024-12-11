import axios from 'axios'
import { getArraysIntersection } from 'utils/index'
import { Playlist, ShortPlaylist, Track } from 'types/index'
import { createLogger } from 'utils/logger'

const logger = createLogger('lib/playlists')

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const SPOTIFY_DOMAIN_URL = 'https://accounts.spotify.com'

const endpoints = {
  authorize: `${SPOTIFY_DOMAIN_URL}/authorize`,
  token: `${SPOTIFY_DOMAIN_URL}/api/token`,
  playlists: `${SPOTIFY_API_URL}/playlists`,
}

export const getPlaylistById = async (playlistId: string) => {
  logger.info(`Getting playlist by id ${playlistId}`)
  // const accessToken = await auth('');
  const accessToken =
    'BQC8RT5BFYTInkLxh0G2kYr3EWCKSi6RCucmE9p4rPceGVgEMbjAKdTlvoZQYEuhKMi_89zGKBe11pLX0PDyShxtmRHgbQRcPYDtKL2DHHARYE8bFWBq133OD6b5rscMN2fES-2HT7AYUzNsOT3TpM56PfYH_gj7uc0k7dWBbRl3HDSfMCkxrFOOwiBdsc-tDtcRwJ-1Mu1pCF24sh9cx-Um-ijc2O26uRoRVexDBuwf6syD'
  try {
    const res = await axios
      .get(`${endpoints.playlists}/${playlistId}`, {
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
    logger.error(
      `getPlaylistById Error: ${e.response?.data || e.request || e.message}`
    )
    return
  }
}

export const findCrossPlaylist = async (
  playlistIds: string[]
): Promise<ShortPlaylist[]> => {
  logger.info(`Finding a cross-playlist for playlists ${playlistIds}`)

  const playlists: (Playlist | undefined)[] = await Promise.all(
    playlistIds.map(async (id) => {
      const foundPlaylist = await getPlaylistById(id)
      if (!foundPlaylist) {
        logger.error(`Playlist with id ${id} wasn't found.`)
        return
      }
      return foundPlaylist
    })
  )

  if (playlists.some((i) => !i)) return []

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
