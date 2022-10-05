export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
};

export function mapTrack(raw: any): Track {
  return {
    id: raw.id,
    title: raw?.title,
    artist: raw?.artist?.name,
    album: raw?.album?.title,
    duration: parseInt(raw?.duration, 10),
    imageSmallUrl: raw?.album?.cover_small,
    imageMediumUrl: raw?.album?.cover_medium,
    imageLargeUrl: raw?.album?.cover_big,
  };
}
