export type ItemType = 'artist' | 'album' | 'track' | 'user' | 'playlist'

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: ItemType
  uri: string
}

interface ShortArtist {
  id: string
  name: string
}

export interface User {
  display_name: string
  external_urls: ExternalUrls
  href: string
  id: string
  type: ItemType
  uri: string
}

export interface ExternalUrls {
  [key: string]: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Album {
  album_type: string
  artists: Artist[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: ItemType
  uri: string
}

export interface Track {
  album: Album
  artists: Artist[]
  disc_number: number
  duration_ms: number
  episode: boolean
  explicit: boolean
  external_ids: ExternalUrls
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  is_playable: boolean
  name: string
  popularity: number
  preview_url: string
  track: boolean
  track_number: number
  type: ItemType
  uri: string
}

export interface Playlist {
  collaborative: boolean
  public: boolean
  name: string
  description: string
  owner: User
  href: string
  id: string
  type: ItemType
  uri: string
  tracks: {
    items: {
      track: Track
    }[]
  }
}

export interface ShortPlaylist {
  id: string
  name: string
  artists: ShortArtist[]
}

export enum SpotifyAuthScope {
  PlaylistReadPrivate = 'playlist-read-private',
  PlaylistReadPublic = 'playlist-read-public',
  PlaylistModifyPrivate = 'playlist-modify-private',
  PlaylistModifyPublic = 'playlist-modify-public',
}

export interface SpotifyAuthResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}
