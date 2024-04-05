import type { NextApiRequest, NextApiResponse } from 'next'
import { createLogger } from 'utils/logger'
import { findCrossPlaylist } from 'lib/playlists'

const logger = createLogger('api/playlists/cross')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  logger.info(`findCrossPlaylist`)
  const { p: playlists } = req.query as { p: string }
  const playlistIds = playlists?.split(',').filter((id) => id.length > 0)

  if (!playlists || playlistIds?.length < 2) {
    logger.error(
      `Bad request: no or <2 playlists in query ${JSON.stringify(req.query)}`
    )
    return res.status(400)
  }

  const result = await findCrossPlaylist(playlistIds)
  return res.status(200).json(result)
}
