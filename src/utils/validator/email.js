export function isEmail(value) {
  return typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value);
}
