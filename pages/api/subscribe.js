import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, firstName, lastName, organization, admin_email, subject } = req.body;
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('organization', organization);
      formData.append('admin_email', admin_email);
      formData.append('_wpcf7_unit_tag', 'wpcf7-f6091-o1');
      const promises = [
        axios.post(process.env.SUBSCRIBE_FORM_POST_ENDPOINT, formData, {
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
}
