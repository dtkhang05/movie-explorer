import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!TMDB_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'TMDB access token is not configured.' });
  }

  // req.url when calling /api/tmdb?path=/movie/popular&page=1 will contain the entire query string
  const { path, ...queryParams } = req.query;
  const pathSegments = Array.isArray(path) ? path.join('/') : (path || '');

  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  const targetUrl = `${TMDB_API_BASE_URL}/${pathSegments}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy internal error.' });
  }
}
