export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'track' | 'artist' | 'album' | 'playlist';
  imageSmallUrl: string;
  imageMediumUrl: string;
  imageLargeUrl: string;
};

export function mapSearchResult(raw: any): SearchResult {
  return {
    id: raw.id.toString(),
    title: raw?.title || raw?.name,
    subtitle: raw?.artist?.name,
    type: raw.type,
    imageSmallUrl:
      raw?.cover_small ||
      raw?.picture_small ||
      raw?.album?.cover_small ||
      raw?.artist?.picture_small,
    imageMediumUrl:
      raw?.cover_medium ||
      raw?.picture_medium ||
      raw?.album?.cover_medium ||
      raw?.artist?.picture_medium,
    imageLargeUrl:
      raw?.cover_big ||
      raw?.picture_large ||
      raw?.album?.cover_big ||
      raw?.artist?.picture_large,
  };
}
