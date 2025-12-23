import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = 'us22'; // Replace with your Mailchimp server prefix, e.g., us19
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/campaigns`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params: {
        fields: 'campaigns.id,campaigns.settings.title,campaigns.archive_url,campaigns.send_time,campaigns.social_card.image_url', // Include social_card.image_url
        count: 20, // Specify how many campaigns to retrieve (optional, max 1000)
      },
    });

    const campaigns = response.data.campaigns.map(campaign => ({
      title: campaign.settings.title,
      url: campaign.archive_url,
      date: campaign.send_time,
      image: campaign?.social_card?.image_url,  // Fetch the social card image URL
    }));

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}
