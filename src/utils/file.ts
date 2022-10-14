import RNFetchBlob from 'react-native-blob-util';
import path from 'path-browserify';
import jsmediatags from 'jsmediatags';

/**
 * List recursively the files located into a directory
 *
 * @param dirpath the path
 */
export async function recursiveLs(dirpath: string): Promise<string[]> {
  const elems = await Promise.all(
    (
      await RNFetchBlob.fs.ls(dirpath)
    ).map(async filename => ({
      filepath: path.join(dirpath, filename),
      isDir: await RNFetchBlob.fs.isDir(path.join(dirpath, filename)),
    })),
  );

  let filenames = elems.filter(elem => !elem.isDir).map(elem => elem.filepath);
  const dirnames = elems.filter(elem => elem.isDir).map(elem => elem.filepath);

  const promises = dirnames.map(async dirname => {
    const dirElems = await recursiveLs(dirname);
    filenames = [...filenames, ...dirElems];
  });

  await Promise.all(promises);

  return filenames;
}

export function readMetaTags(filepath: string): Promise<{
  title?: string;
  artist?: string;
  album?: string;
}> {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(filepath)
      .setTagsToRead(['title', 'artist', 'album'])
      .read({
        onSuccess: tag => {
          resolve(tag.tags);
        },
        onError: error => {
          reject(error);
        },
      });
  });
}
