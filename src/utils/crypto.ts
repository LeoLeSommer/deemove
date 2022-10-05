import CryptoJs from 'crypto-js';
import Blowfish from 'egoroof-blowfish';
import {Buffer} from 'buffer';

export function md5Encrypt(data: string) {
  return CryptoJs.MD5(CryptoJs.enc.Latin1.parse(data)).toString(
    CryptoJs.enc.Hex,
  );
}

export function ecbEncrypt(key: string, data: string) {
  return CryptoJs.AES.encrypt(
    CryptoJs.enc.Latin1.parse(data),
    CryptoJs.enc.Latin1.parse(key),
    {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.NoPadding,
      iv: CryptoJs.enc.Latin1.parse(''),
    },
  ).ciphertext.toString(CryptoJs.enc.Hex);
}

export function blowfishDecrypt(key: string, data: Buffer): Buffer {
  let cipher = new Blowfish(key, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
  cipher.setIv(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]));
  return Buffer.from(cipher.decode(data, Blowfish.TYPE.UINT8_ARRAY));
}

export function generateBlowfishKey(trackId: string) {
  const SECRET = 'g4el58wc0zvf9na1';

  const idMd5 = md5Encrypt(trackId);

  let bfKey = '';
  for (let i = 0; i < 16; i += 1) {
    bfKey += String.fromCharCode(
      idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i),
    );
  }

  return bfKey;
}
