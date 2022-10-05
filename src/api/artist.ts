import {useDeezerEntry, useDeezerList} from '../hooks/api';
import {mapAlbum} from '../models/Album';
import {mapArtist} from '../models/Artist';
import {mapPlaylist} from '../models/Playlist';
import {mapTrack} from '../models/Track';

export function useArtist(id: string) {
  return useDeezerEntry(`artist/${id}`, mapArtist);
}

export function useArtistTopTracks(id: string) {
  return useDeezerList(`artist/${id}/top`, mapTrack);
}

export function useArtistAlbums(id: string) {
  return useDeezerList(`artist/${id}/albums`, mapAlbum);
}

export function useArtistPlaylists(id: string) {
  return useDeezerList(`artist/${id}/playlists`, mapPlaylist);
}

export function useArtistRelatedArtists(id: string) {
  return useDeezerList(`artist/${id}/related`, mapArtist);
}
