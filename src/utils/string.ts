export function escapeDoubleQuotes(str: string | null | undefined) {
  return str && str.replace('"', '\\"');
}
