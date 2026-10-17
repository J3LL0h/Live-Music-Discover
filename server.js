//import libraries
// import fetch from 'node-fetch';   
import express from 'express';

const app = express();                   // initialize express 

// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static('public'))
// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get('/', (req, res) => { res.redirect('/index.html') })

// Proxy event searches to Ticketmaster without exposing the API key to the frontend.
app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;

  if (typeof keyword !== 'string' || !keyword.trim()) {
    return res.status(400).send({ error: 'A keyword query parameter is required.' });
  }

  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    return res.status(500).send({ error: 'Ticketmaster API key is not configured.' });
  }

  const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
  const params = new URLSearchParams({
    apikey: apiKey,
    keyword: keyword.trim(),
    countryCode: 'CA'
  });

  for (const name of ['city', 'classificationName']) {
    const value = req.query[name];
    if (typeof value === 'string' && value.trim()) {
      params.set(name, value.trim());
    }
  }

  url.search = params.toString();

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(502).send({ error: error.message });
  }
});

const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
