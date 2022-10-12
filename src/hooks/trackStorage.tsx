import React, {
  ReactNode,
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import pathBrowserify from 'path-browserify';
// @ts-ignore
import MediaMeta from 'react-native-media-meta';
import RNFetchBlob from 'react-native-blob-util';
import {match} from 'ts-pattern';
import {uniqBy} from 'lodash';
import {LocalTrack} from '../models/LocalTrack';
import {LocalArtist} from '../models/LocalArtist';
import {LocalAlbum} from '../models/LocalAlbum';
import {Track} from '../models/Track';
import {Artist} from '../models/Artist';
import {Album} from '../models/Album';
import useSettings from './settings';
import {recursiveLs} from '../utils/file';
import {upsert} from '../utils/array';
import {getTrackFilepath} from '../api/download';

export type DownloadQueueElem = {
  trackId: string;
  status: 'downloading' | 'pending';
};

export type TrackStorageState = {
  tracks: {
    [key: string]: {
      isLoadingFilesystem: boolean;
      isDownloading: boolean;
      alreadyDownloaded: boolean;
      downloadProgress: number;
      track?: LocalTrack;
    };
  };
  artists: {
    [key: string]: LocalArtist;
  };
  albums: {
    [key: string]: LocalAlbum;
  };
  downloadQueue: DownloadQueueElem[];
};

export type TrackStorageAction =
  | {
      type: 'CHECK_STORED_TRACK_START';
      filepath: string;
    }
  | {
      type: 'CHECK_STORED_TRACK_END';
      exists: boolean;
      filepath: string;
      track: LocalTrack | null;
    }
  | {
      type: 'CHECK_STORED_ARTIST_END';
      artist: LocalArtist;
    }
  | {
      type: 'CHECK_STORED_ALBUM_END';
      album: LocalAlbum;
    }
  | {
      type: 'STORED_TRACK_DELETED';
      filepath: string;
    }
  | {
      type: 'DOWNLOAD_START';
      trackId: string;
      filepath: string;
    }
  | {
      type: 'DOWNLOAD_PENDING';
      trackId: string;
      filepath: string;
      progress: number;
    }
  | {
      type: 'DOWNLOAD_ERR';
      trackId: string;
      filepath: string;
    }
  | {
      type: 'DOWNLOAD_END';
      trackId: string;
      filepath: string;
      track: LocalTrack;
    }
  | {
      type: 'DOWNLOAD_REQUESTED';
      trackId: string;
    }
  | {
      type: 'DOWNLOAD_REQUEST_REMOVED';
      trackId: string;
    }
  | {
      type: 'DOWNLOAD_QUEUE_LOADED';
      trackIds: string[];
    };

export type TrackStorageContext = TrackStorageState & {
  dispatch: React.Dispatch<TrackStorageAction>;
  deleteTrack: (track: {
    title: string;
    album: string;
    artist: string;
  }) => Promise<void>;
};

const TrackStorageContext = createContext<TrackStorageContext>({} as any);

export type TrackStorageProviderProps = {
  children: ReactNode;
};

export function TrackStorageProvider({children}: TrackStorageProviderProps) {
  const {downloadDirectory} = useSettings();

  const [trackStorage, dispatch] = useReducer(
    (state: TrackStorageState, action: TrackStorageAction) => {
      console.log(action);

      return match(action)
        .with({type: 'CHECK_STORED_TRACK_START'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: true,
              isDownloading: false,
              alreadyDownloaded: false,
              downloadProgress: 0,
            },
          }),
        }))
        .with({type: 'CHECK_STORED_TRACK_END'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: false,
              isDownloading: false,
              alreadyDownloaded: elem.exists,
              downloadProgress: 0,
              track: elem.track,
            },
          }),
        }))
        .with({type: 'CHECK_STORED_ARTIST_END'}, elem => ({
          ...state,
          artists: Object.assign(state.artists, {
            [elem.artist.path]: elem.artist,
          }),
        }))
        .with({type: 'CHECK_STORED_ALBUM_END'}, elem => ({
          ...state,
          albums: Object.assign(state.albums, {
            [elem.album.path]: elem.album,
          }),
        }))
        .with({type: 'STORED_TRACK_DELETED'}, elem => ({
          ...state,
          tracks: Object.assign({}, state.tracks, {
            [elem.filepath]: {
              ...state.tracks[elem.filepath],
              alreadyDownloaded: false,
            },
          }),
        }))
        .with({type: 'DOWNLOAD_START'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: false,
              isDownloading: true,
              alreadyDownloaded: false,
              downloadProgress: 0,
            },
          }),
          downloadQueue: upsert<DownloadQueueElem>(
            state.downloadQueue,
            downloadItem => downloadItem.trackId === elem.trackId,
            () => ({trackId: elem.trackId, status: 'downloading'}),
          ),
        }))
        .with({type: 'DOWNLOAD_PENDING'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: false,
              isDownloading: true,
              alreadyDownloaded: false,
              downloadProgress: elem.progress,
            },
          }),
        }))
        .with({type: 'DOWNLOAD_ERR'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: false,
              isDownloading: false,
              alreadyDownloaded: false,
              downloadProgress: 0,
              track: undefined,
            },
          }),
          downloadQueue: upsert<DownloadQueueElem>(
            state.downloadQueue,
            downloadItem => downloadItem.trackId === elem.trackId,
            () => ({trackId: elem.trackId, status: 'pending'}),
          ),
        }))
        .with({type: 'DOWNLOAD_END'}, elem => ({
          ...state,
          tracks: Object.assign(state.tracks, {
            [elem.filepath]: {
              isLoadingFilesystem: false,
              isDownloading: false,
              alreadyDownloaded: true,
              downloadProgress: 1,
              track: elem.track,
            },
          }),
          downloadQueue: state.downloadQueue.filter(
            queueItem => elem.trackId !== queueItem.trackId,
          ),
        }))
        .with({type: 'DOWNLOAD_REQUESTED'}, elem => ({
          ...state,
          downloadQueue: [
            ...state.downloadQueue,
            {trackId: elem.trackId, status: 'pending'} as DownloadQueueElem,
          ],
        }))
        .with({type: 'DOWNLOAD_REQUEST_REMOVED'}, elem => ({
          ...state,
          downloadQueue: state.downloadQueue.filter(
            queueItem => elem.trackId !== queueItem.trackId,
          ),
        }))
        .with({type: 'DOWNLOAD_QUEUE_LOADED'}, elem => ({
          ...state,
          downloadQueue: elem.trackIds.map(
            trackId =>
              ({
                trackId: trackId,
                status: 'pending',
              } as DownloadQueueElem),
          ),
        }))
        .exhaustive();
    },
    {
      tracks: {},
      artists: {},
      albums: {},
      downloadQueue: [],
    },
  );

  // Scan the music folder to have the local library
  useEffect(() => {
    async function fetchData() {
      if (!downloadDirectory) {
        return;
      }

      const filepaths = (await recursiveLs(downloadDirectory)).filter(
        filepath => pathBrowserify.extname(filepath) === '.mp3',
      );

      const tracks = (
        await Promise.all(
          filepaths.map(async filepath => {
            dispatch({
              type: 'CHECK_STORED_TRACK_START',
              filepath,
            });

            const tags = await MediaMeta.get(filepath);

            const track = {
              title: tags.title,
              artist: tags.artist,
              album: tags.album,
              path: filepath,
              coverPath: pathBrowserify.join(
                pathBrowserify.dirname(filepath),
                'cover.jpg',
              ),
            } as LocalTrack;

            if (!tags.title || !tags.artist || !tags.album) {
              dispatch({
                type: 'CHECK_STORED_TRACK_END',
                exists: false,
                filepath,
                track: null,
              });

              return;
            }

            dispatch({
              type: 'CHECK_STORED_TRACK_END',
              exists: true,
              filepath,
              track,
            });

            return track;
          }),
        )
      ).filter(track => track) as LocalTrack[];

      const albums = uniqBy(
        tracks.map(
          track =>
            ({
              name: track.album,
              artist: track.artist,
              path: pathBrowserify.dirname(track.path),
              coverPath: pathBrowserify.join(
                pathBrowserify.dirname(track.path),
                'cover.jpg',
              ),
            } as LocalAlbum),
        ),
        track => track.path,
      );

      await Promise.all(
        albums.map(async album => {
          dispatch({
            type: 'CHECK_STORED_ALBUM_END',
            album,
          });
        }),
      );

      const artists = uniqBy(
        tracks.map(
          track =>
            ({
              name: track.album,
              artist: track.artist,
              path: pathBrowserify.dirname(track.path),
              coverPath: pathBrowserify.join(
                pathBrowserify.dirname(track.path),
                'cover.jpg',
              ),
            } as LocalArtist),
        ),
        track => track.path,
      );

      await Promise.all(
        artists.map(async artist => {
          dispatch({
            type: 'CHECK_STORED_ARTIST_END',
            artist,
          });
        }),
      );
    }

    fetchData();
  }, [downloadDirectory]);

  const deleteTrack = useCallback(
    async (track: {title: string; album: string; artist: string}) => {
      const filepath = getTrackFilepath(downloadDirectory, track);

      if (filepath) {
        await RNFetchBlob.fs.unlink(filepath);
        dispatch({
          type: 'STORED_TRACK_DELETED',
          filepath,
        });
      }
    },
    [downloadDirectory],
  );

  const result = {
    ...trackStorage,
    dispatch,
    deleteTrack,
  };

  return (
    <TrackStorageContext.Provider value={result}>
      {children}
    </TrackStorageContext.Provider>
  );
}

export default function useTrackStorage(): TrackStorageContext {
  return useContext(TrackStorageContext);
}

export function useStoredTrack(path: string | null) {
  const {tracks} = useTrackStorage();
  return (path && tracks[path]?.track) || null;
}

export function useStoredTracks(): Track[] {
  const {tracks} = useTrackStorage();

  return Object.keys(tracks)
    .filter(key => tracks[key]?.alreadyDownloaded)
    .map(key => tracks[key]?.track as LocalTrack)
    .filter(track => track)
    .map(track => ({
      id: track.path,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: 0,
      imageSmallUrl: `file://${track.coverPath}`,
      imageMediumUrl: `file://${track.coverPath}`,
      imageLargeUrl: `file://${track.coverPath}`,
    }));
}

export function useStoredArtists(): Artist[] {
  const {artists} = useTrackStorage();

  return Object.keys(artists)
    .map(key => artists[key])
    .map(artist => ({
      id: artist.path,
      name: artist.name,
      imageSmallUrl: `file://${artist.coverPath}`,
      imageMediumUrl: `file://${artist.coverPath}`,
      imageLargeUrl: `file://${artist.coverPath}`,
    }));
}

export function useStoredArtist(path: string): Artist | null {
  const {artists} = useTrackStorage();

  return (
    artists[path] && {
      id: artists[path].path,
      name: artists[path].name,
      imageSmallUrl: `file://${artists[path].coverPath}`,
      imageMediumUrl: `file://${artists[path].coverPath}`,
      imageLargeUrl: `file://${artists[path].coverPath}`,
    }
  );
}

export function useStoredArtistTracks(path: string): Track[] {
  const {artists} = useTrackStorage();
  const tracks = useStoredTracks();
  const artistName = artists[path] && artists[path].name;

  return tracks.filter(track => track.artist === artistName);
}

export function useStoredArtistAlbums(path: string): Album[] {
  const {artists} = useTrackStorage();
  const albums = useStoredAlbums();
  const artistName = artists[path] && artists[path].name;

  return albums.filter(album => album.artistName === artistName);
}

export function useStoredAlbums(): Album[] {
  const {albums} = useTrackStorage();

  return Object.keys(albums)
    .map(key => albums[key])
    .map(album => ({
      id: album.path,
      name: album.name,
      artistName: album.artist,
      imageSmallUrl: `file://${album.coverPath}`,
      imageMediumUrl: `file://${album.coverPath}`,
      imageLargeUrl: `file://${album.coverPath}`,
    }));
}

export function useStoredAlbum(path: string): Album | null {
  const {albums} = useTrackStorage();
  const tracks = useStoredTracks();

  return (
    albums[path] && {
      id: albums[path].path,
      name: albums[path].name,
      artistName: albums[path].artist,
      imageSmallUrl: `file://${albums[path].coverPath}`,
      imageMediumUrl: `file://${albums[path].coverPath}`,
      imageLargeUrl: `file://${albums[path].coverPath}`,
      tracks: tracks.filter(
        track =>
          track.album === albums[path].name &&
          track.artist === albums[path].artist,
      ),
    }
  );
}
