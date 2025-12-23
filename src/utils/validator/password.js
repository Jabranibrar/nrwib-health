export function validatePassword(password) {
  // Check if the password is a string and has at least 8 characters
  const hasMinLength = typeof password === 'string' && password.length >= 6;

  // Check if the password has at least one number
  const hasNumber = /\d/.test(password);

  // Check if the password has at least one letter
  // const hasLetter = /[a-zA-Z]/.test(password);
  //
  // // Check if the password includes both uppercase and lowercase characters
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);

  // return hasMinLength && hasNumber && hasLetter && hasUpperCase && hasLowerCase;
  return hasMinLength && hasNumber;
}
