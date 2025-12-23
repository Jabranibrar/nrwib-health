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
      firstName,
      lastName,
      email,
      phoneNumber,
      title,
      schoolName,
      days,
      preferredSpeaker,
      numberOfStudents,
      grades,
      timeSlots,
      subject,
      admin_email,
      _wpcf7_unit_tag
    } = fields;

    const formData = new FormData();
    // Create FormData object

    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('title', title);
    formData.append('school_name', schoolName);
    formData.append('number_of_students', numberOfStudents);
    formData.append('grades', grades);
    formData.append('days_of_week', days);
    formData.append('time_slot', timeSlots);
    formData.append('preferred_speaker', preferredSpeaker);
    formData.append('subject', subject);
    formData.append('admin_email', admin_email);
    formData.append('_wpcf7_unit_tag', _wpcf7_unit_tag);
    const promises = [
      axios.post(process.env.EXPRESS_INTEREST_FORM_POST_ENDPOINT, formData, {
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
