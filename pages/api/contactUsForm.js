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
      role,
      inquiryReason,
      otherReason,
      firstName,
      lastName,
      email,
      streetAddress,
      suite,
      city,
      state,
      zipCode,
      message,
      checkbox,
      subject,
      adminEmail,
      _wpcf7_unit_tag
    } = fields;

    const formData = new FormData();
    // Create FormData object

    formData.append('role', role);
    formData.append('option', inquiryReason);
    formData.append('other_reason', otherReason);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('street_address', streetAddress);
    formData.append('appartment_type', suite);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip_code', zipCode);
    formData.append('message', message);
    formData.append('checkbox', checkbox);
    formData.append('subject', subject);
    formData.append('admin_email', adminEmail);
    formData.append('_wpcf7_unit_tag', _wpcf7_unit_tag);
    const promises = [
      axios.post(process.env.CONTACT_US_FORM_POST_ENDPOINT, formData, {
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
