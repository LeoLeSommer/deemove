import {mapTrack, Track} from './Track';

export type Album = {
  id: string;
  name: string;
  artistName: string;
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
  tracks?: Track[];
};

export function mapAlbum(raw: any): Album {
  return {
    id: raw.id.toString(),
    name: raw?.title,
    artistName: raw?.artist?.name,
    imageSmallUrl: raw?.cover_small,
    imageMediumUrl: raw?.cover_medium,
    imageLargeUrl: raw?.cover_big,
    tracks: raw?.tracks?.data?.map(mapTrack),
  };
}
