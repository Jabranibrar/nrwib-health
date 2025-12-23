import axios from 'axios';

export function validateCaptcha(response_key, secret_key) {
  return new Promise(async (resolve, reject) => {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
    try {
      const response = await axios.post(url);
      if (response.data.success) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
}
