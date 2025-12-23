import { Formidable } from 'formidable';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { fields } = await new Promise((resolve, reject) => {
      const form = new Formidable();
      form.parse(req, (err, fields) => {
        if (err) reject({ err });
        resolve({ fields });
      });
    });
    // Extract form fields
    const {
      gender,
      ethnicity,
      age,
      emailAddress,
      subject,
      admin_email,
      first,
      second,
      third,
      forth,
      _wpcf7_unit_tag
    } = fields;

    const formData = new FormData();
    // Create FormData object

    formData.append('gender', gender);
    formData.append('ethnicity', ethnicity);
    formData.append('age', age);
    formData.append('email', emailAddress);
    formData.append('first_question', first);
    formData.append('second_question', second);
    formData.append('third_question', third);
    formData.append('forth_question', forth);
    formData.append('subject', subject);
    formData.append('admin_email', admin_email);
    formData.append('_wpcf7_unit_tag', _wpcf7_unit_tag);
    const promises = [
      axios.post(process.env.FEEDBACK_SURVEY_FORM_POST_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    ];

    const responses = await Promise.allSettled(promises);
    if (responses[0]?.value?.status === 200) {
      return res.status(200).json({ message: 'Success' });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Something went wrong'
    });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};
