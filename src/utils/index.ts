export const getArraysIntersection = <T>(arrays: T[][]): T[] => {
  return arrays.reduce((a, b) => a.filter((c) => b.includes(c)))
}

const playlistRegex =
  /^(https:\/\/open.spotify.com\/playlist\/)([a-zA-Z0-9]+)(.*)$/

export const extractPlaylistIdFromUrl = (url: string) => {
  const playlistUrlMatch = playlistRegex.exec(url || '')
  if (!playlistUrlMatch) return null
  return playlistUrlMatch[2]
}
