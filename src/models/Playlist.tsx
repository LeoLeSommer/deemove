import {mapTrack, Track} from './Track';

export type Playlist = {
  id: string;
  title: string;
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
  tracks?: Track[];
};

export function mapPlaylist(raw: any): Playlist {
  return {
    id: raw.id.toString(),
    title: raw?.title,
    imageSmallUrl: raw?.picture_small,
    imageMediumUrl: raw?.picture_medium,
    imageLargeUrl: raw?.picture_big,
    tracks: raw?.tracks?.data?.map(mapTrack),
  };
}
