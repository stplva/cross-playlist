import { NextRequest } from 'next/server'
import { createLogger } from 'utils/logger'
import { findCrossPlaylist } from 'lib/playlists'
const logger = createLogger('api/playlists/cross')

export async function GET(req: NextRequest) {
  logger.info(`findCrossPlaylist`)
  const searchParams = req.nextUrl.searchParams
  const playlists = searchParams.get('p') as string
  const playlistIds = playlists?.split(',').filter((id) => id.length > 0)

  if (!playlists || playlistIds?.length < 2) {
    logger.error(
      `Bad request: no or <2 playlists in query ${JSON.stringify(searchParams)}`
    )
    return Response.json({}, { status: 400 })
  }

  try {
    const result = await findCrossPlaylist(req, playlistIds)
    return Response.json(result, { status: 200 })
  } catch (e: any) {
    return Response.json(null, { status: e.status || 500 })
  }
}
