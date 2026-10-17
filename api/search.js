
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const keyword = req.query.keyword;

  if (typeof keyword !== 'string' || !keyword.trim()) {
    return res.status(400).json({
      error: 'A keyword query parameter is required.'
    });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    console.error('Missing TICKETMASTER_API_KEY');
    return res.status(500).json({
      error: 'Ticketmaster API key is not configured.'
    });
  }

  const url = new URL(
    'https://app.ticketmaster.com/discovery/v2/events.json'
  );

  url.search = new URLSearchParams({
    apikey: apiKey,
    keyword: keyword.trim(),
    countryCode: 'CA',
    ...(typeof req.query.city === 'string' &&
    req.query.city.trim()
      ? { city: req.query.city.trim() }
      : {}),
    ...(typeof req.query.classificationName === 'string' &&
    req.query.classificationName.trim()
      ? {
          classificationName:
            req.query.classificationName.trim()
        }
      : {})
  }).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Ticketmaster search failed:', error);

    return res.status(502).json({
      error: 'Unable to retrieve events.'
    });
  }
}
