import {ecbEncrypt, md5Encrypt} from '../utils/crypto';

export type TrackDownloadInfos = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artists: string[];
  contributors: string[];
  diskNumber: string;
  trackNumber: string;
  version: string;
  mediaVersion: string;
  md5: string;
  filesizes: number;
  releaseDate: number;
  artistCoverUrl: string;
  albumCoverUrl: string;
  url: string;
};

export const TrackFormats = {
  FLAC: 9,
  MP3_320: 3,
  MP3_128: 1,
  MP4_RA3: 15,
  MP4_RA2: 14,
  MP4_RA1: 13,
  DEFAULT: 8,
  LOCAL: 0,
};

export function mapTrackDownloadInfos(raw: any): TrackDownloadInfos {
  return {
    id: raw?.SNG_ID,
    title: raw?.SNG_TITLE,
    artist: raw?.ART_NAME,
    artists: raw?.ARTISTS?.map((elem: any) => elem.ART_NAME),
    album: raw?.ALB_TITLE,
    contributors:
      raw?.SNG_CONTRIBUTORS?.composer?.map((elem: any) => elem.ART_NAME) || [],
    diskNumber: raw?.DISK_NUMBER,
    trackNumber: raw?.TRACK_NUMBER,
    version: raw?.VERSION,
    mediaVersion: raw?.MEDIA_VERSION,
    md5: raw?.MD5_ORIGIN,
    filesizes: raw?.FILEZISE,
    releaseDate: parseInt(raw?.PHYSICAL_RELEASE_DATE, 10),
    artistCoverUrl: `https://cdns-images.dzcdn.net/images/cover/${
      raw && raw?.ARTISTS[0]?.ART_PICTURE
    }/500x500-000000-80-0-0.jpg`,
    albumCoverUrl: `https://cdns-images.dzcdn.net/images/cover/${raw?.ALB_PICTURE}/500x500-000000-80-0-0.jpg`,
    url: generateCryptedStreamURL(
      raw.SNG_ID,
      raw.MEDIA_VERSION,
      raw.MD5_ORIGIN,
      'MP3_128',
    ),
  };
}

function generateCryptedStreamURL(
  id: string,
  mediaVersion: string,
  md5: string,
  format: keyof typeof TrackFormats = 'MP3_128',
) {
  const streamPath = generateStreamPath(id, mediaVersion, md5, format);
  return 'https://e-cdns-proxy-' + md5[0] + '.dzcdn.net/mobile/1/' + streamPath;
}

function generateStreamPath(
  id: string,
  mediaVersion: string,
  md5: string,
  format: keyof typeof TrackFormats = 'MP3_128',
) {
  let urlPart = `${md5}¤${format}¤${id}¤${mediaVersion}`;
  let md5val = md5Encrypt(urlPart);

  let step2 = `${md5val}¤${urlPart}¤`;
  step2 += '.'.repeat(16 - (step2.length % 16));

  const step3 = ecbEncrypt('jo6aey6haid2Teih', step2);
  return step3;
}
