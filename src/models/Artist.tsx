export type Artist = {
  id: string;
  name: string;
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
};

export function mapArtist(raw: any): Artist {
  return {
    id: raw.id,
    name: raw?.name,
    imageSmallUrl: raw?.picture_small,
    imageMediumUrl: raw?.picture_medium,
    imageLargeUrl: raw?.picture_big,
  };
}
