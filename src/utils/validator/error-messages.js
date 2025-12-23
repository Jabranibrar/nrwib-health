export function filterLoginErrorMessage(errorMessage) {
  if (['incorrect_password', 'invalid_email', 'invalid_username'].includes(errorMessage)) {
    return 'The email or the password is incorrect.'
  }

  return errorMessage;
}

export function filterRegistrationErrorMessage(errorMessage) {
  return errorMessage.replace(/username/g, 'email');
}
