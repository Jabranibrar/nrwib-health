export function isPhoneNumber(phoneNumber) {
  return typeof phoneNumber === 'string' && /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber);
}
