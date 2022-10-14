import {useCallback} from 'react';
import path from 'path-browserify';
import RNFetchBlob from 'react-native-blob-util';
import {Cookie} from 'tough-cookie';
import {Buffer} from 'buffer';
// @ts-ignore
import ID3Writer from 'browser-id3-writer';
import {
  mapTrackDownloadInfos,
  TrackDownloadInfos,
} from '../models/TrackDownloadInfos';
import {getDeezerOldApiEntry, useDeezerOldApiEntry} from '../hooks/api';
import useSettings from '../hooks/settings';
import useTrackStorage, {TrackStorageAction} from '../hooks/trackStorage';
import useCookie from '../hooks/cookie';
import useUser from '../hooks/user';
import {blowfishDecrypt, generateBlowfishKey} from '../utils/crypto';
import useError from '../hooks/error';
import {DeezerApiError} from '../models/DeezerApiError';

export function useTrackDownloadInfos(trackId: string) {
  return useDeezerOldApiEntry('song.getData', mapTrackDownloadInfos, {
    SNG_ID: trackId,
  });
}

export function getTrackFilepath(
  downloadDirectory: string | null,
  trackInfos: {
    artist: string;
    album: string;
    title: string;
  } | null,
) {
  return (
    downloadDirectory &&
    trackInfos &&
    trackInfos.artist &&
    trackInfos.album &&
    trackInfos.title &&
    path.join(
      downloadDirectory,
      trackInfos.artist,
      trackInfos.album,
      `${trackInfos.artist} - ${trackInfos.title}.mp3`,
    )
  );
}

export function useDownloadTrack() {
  const {oldApiAccessToken} = useUser();
  const {cookie} = useCookie();
  const {dispatch} = useTrackStorage();
  const {downloadDirectory} = useSettings();
  const {pushError} = useError();

  return useCallback(
    async (trackId: string) => {
      // Get infos needed to download the file
      const downloadInfos = await getTrackDownloadInfos(
        trackId,
        oldApiAccessToken,
        cookie,
        pushError,
      );

      if (!downloadDirectory || !downloadInfos) {
        return;
      }

      // Get file path
      const filepath = path.join(
        downloadDirectory,
        downloadInfos?.artist,
        downloadInfos?.album,
        `${downloadInfos?.artist} - ${downloadInfos?.title}.mp3`,
      );

      if (!filepath) {
        return;
      }

      try {
        // Notify that we started to download
        dispatch({
          type: 'DOWNLOAD_START',
          trackId,
          filepath,
        });

        // Download the artist image and build the artist directory
        await initializeArtistDirectory(downloadDirectory, downloadInfos);

        // Download the album image and build the album directory
        await initializeAlbumDirectory(downloadDirectory, downloadInfos);

        // Download the track
        const tempFilepath = filepath + 'temp';
        await deleteIfExists(tempFilepath);
        await downloadTrack(
          trackId,
          filepath,
          tempFilepath,
          downloadInfos,
          dispatch,
        );

        // Delete the old track if exists
        await deleteIfExists(filepath);

        // Decrypt the track
        await decryptTrack(
          tempFilepath,
          filepath,
          downloadInfos,
          downloadDirectory,
        );

        // Remove the encrypted track
        await deleteIfExists(tempFilepath);

        // Notify that we finished to download
        dispatch({
          type: 'DOWNLOAD_END',
          trackId,
          filepath,
          track: {
            ...downloadInfos,
            path: filepath,
            coverPath: path.join(path.dirname(filepath), 'cover.jpg'),
          },
        });
      } catch (err) {
        dispatch({
          type: 'DOWNLOAD_ERR',
          trackId,
          filepath,
        });
      }
    },
    [dispatch, cookie, oldApiAccessToken, downloadDirectory, pushError],
  );
}

function getTrackDownloadInfos(
  trackId: string,
  oldApiAccessToken: string | null,
  cookie: Cookie,
  pushError: (err: DeezerApiError | Error) => void,
) {
  return getDeezerOldApiEntry(
    'song.getData',
    mapTrackDownloadInfos,
    {
      SNG_ID: trackId,
    },
    {},
    oldApiAccessToken,
    cookie,
    pushError,
  );
}

async function downloadTrack(
  trackId: string,
  filepath: string,
  tempFilepath: string,
  downloadInfos: TrackDownloadInfos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: React.Dispatch<TrackStorageAction>,
) {
  return RNFetchBlob.config({
    path: tempFilepath,
  }).fetch('GET', downloadInfos.url);
  /*.progress((received, total) => {
      dispatch({
        type: 'DOWNLOAD_PENDING',
        trackId,
        filepath,
        progress: received / total,
      });
    });*/
}

async function decryptTrack(
  input: string,
  output: string,
  downloadInfos: TrackDownloadInfos,
  downloadDirectory: string,
): Promise<undefined> {
  const fileFormat = 'base64';

  const write = await RNFetchBlob.fs.writeStream(output, fileFormat);
  const read = await RNFetchBlob.fs.readStream(input, fileFormat, 2048);

  const chunks: Buffer[] = [];
  const blowfishKey = generateBlowfishKey(downloadInfos.id);

  return new Promise((resolve, reject) => {
    let i = 0;
    read.open();

    (read.onData as any)((chunk: string) => {
      const data = Buffer.from(chunk, fileFormat);
      chunks.push(decryptChunk(data, i, blowfishKey));
      i += 1;
    });

    read.onEnd(() => {
      const content = Buffer.concat(chunks);

      // Write metadatas
      writeMetadatas(content, downloadInfos, downloadDirectory).then(
        metadataContent => {
          write.write(metadataContent.toString(fileFormat)).then(() => {
            resolve(undefined);
          });
        },
      );
    });

    read.onError(err => {
      reject(err);
    });
  });
}

function decryptChunk(data: Buffer, i: number, blowfishKey: string): Buffer {
  const isEncrypted = i % 3 === 0 && data.length === 2048;

  if (isEncrypted) {
    return blowfishDecrypt(blowfishKey, data);
  } else {
    return data;
  }
}

async function deleteIfExists(filename: string) {
  try {
    await RNFetchBlob.fs.unlink(filename);
  } catch (err) {}
}

async function initializeArtistDirectory(
  downloadDirectory: string,
  trackInfos: {
    artist: string;
    album: string;
    title: string;
    artistCoverUrl: string;
    albumCoverUrl: string;
  },
) {
  return initializeDirectory(
    path.join(downloadDirectory, trackInfos?.artist),
    trackInfos,
    trackInfos.artistCoverUrl,
  );
}

async function initializeAlbumDirectory(
  downloadDirectory: string,
  trackInfos: {
    artist: string;
    album: string;
    title: string;
    artistCoverUrl: string;
    albumCoverUrl: string;
  },
) {
  return initializeDirectory(
    path.join(downloadDirectory, trackInfos?.artist, trackInfos?.album),
    trackInfos,
    trackInfos.albumCoverUrl,
  );
}

async function initializeDirectory(
  directoryPath: string,
  trackInfos: {
    artist: string;
    album: string;
    title: string;
    artistCoverUrl: string;
    albumCoverUrl: string;
  },
  coverUrl: string,
) {
  const coverPath = path.join(directoryPath, 'cover.jpg');

  if (!(await RNFetchBlob.fs.exists(directoryPath))) {
    await RNFetchBlob.fs.mkdir(path.dirname(coverPath));
  }

  if (!(await RNFetchBlob.fs.exists(coverPath))) {
    await RNFetchBlob.config({
      path: coverPath,
    }).fetch('GET', coverUrl, {});
  }
}

async function writeMetadatas(
  content: Buffer,
  downloadInfos: TrackDownloadInfos,
  downloadDirectory: string,
) {
  const metadatas = {
    TIT2: downloadInfos.title,
    TALB: downloadInfos.album,
    TPE1: downloadInfos.artists,
    TPE2: downloadInfos.artist,
    TCOM: downloadInfos.contributors,
    TPOS: downloadInfos.diskNumber,
    TRCK: downloadInfos.trackNumber,
    TYER: downloadInfos.releaseDate.toString(),
  };

  const writer = new ID3Writer(content);
  const coverPath = path.join(
    downloadDirectory,
    downloadInfos?.artist,
    downloadInfos?.album,
    'cover.jpg',
  );
  const coverArrayBuffer = Buffer.from(
    await RNFetchBlob.fs.readFile(coverPath, 'base64'),
    'base64',
  );

  Object.keys(metadatas).forEach(key =>
    writer.setFrame(key, (metadatas as any)[key]),
  );
  writer.setFrame('APIC', {
    type: 3,
    data: coverArrayBuffer,
    description: 'Super picture',
  });
  writer.addTag();

  return Buffer.from(writer.arrayBuffer);
}
