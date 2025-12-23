import axios from 'axios';
import {getPageUri} from "@/src/utils/helpers";

export default async function handler(req, res) {
  const {
    body: { post },
  } = req;

  if (
    req.headers.authorization !== `Bearer ${process.env.REVALIDATE_SECRET_KEY}`
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  } else {
    await axios.get(process.env.REDEPLOY_URL);
  }

  try {
    const { uri, slug, type } = post || {};

    const actualPath = await getPageUri(uri, slug, type);

    // Revalidate the specified path
    await res.revalidate(actualPath);
    if (type === "members") {
      await res.revalidate("/careers/");
    }
    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
