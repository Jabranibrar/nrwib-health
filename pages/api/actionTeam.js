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
      subject,
      firstName,
      lastName,
      email,
      title,
      organization,
      zipCode,
      speciality,
      interests,
      team,
      selectedCondition,
      challenges,
      admin_email,
      _wpcf7_unit_tag
    } = fields;

    const formData = new FormData();
    // Create FormData object

    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('title', title);
    formData.append('organization', organization);
    formData.append('zip_code', zipCode);
    formData.append('speciality', speciality);
    formData.append('interests', interests);
    formData.append('team', team);
    formData.append('team_question', selectedCondition);
    formData.append('challenge', challenges);
    formData.append('subject', subject);
    formData.append('admin_email', admin_email);
    formData.append('_wpcf7_unit_tag', _wpcf7_unit_tag);
    const promises = [
      axios.post(process.env.ACTION_TEAM_FORM_POST_ENDPOINT, formData, {
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
