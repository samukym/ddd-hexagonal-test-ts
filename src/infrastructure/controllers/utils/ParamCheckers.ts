export function isUUIDValid(uuid: string): boolean {
  if (!uuid) return false;
  uuid = uuid.replace(/-/g, "");
  return uuid.length === 32 && [...uuid].every(isHEX);
}
function isHEX(char: string) {
  return "0123456789abcdef".includes(char.toLowerCase());
}
