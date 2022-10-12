export class DeezerApiError extends Error {
  deezerCode: string;

  constructor(message: string, deezerCode: string) {
    super(message);
    this.deezerCode = deezerCode;
  }
}
