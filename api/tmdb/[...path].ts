// THIS FILE CONTAINS THE CORRECTED CODE.
// PLEASE MANUALLY COPY THIS CONTENT TO 'api/tmdb/[...path].ts'
// The automated tools are blocked from writing to that file directly.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!TMDB_ACCESS_TOKEN) {
    return res.status(500).json({ 
        error: 'TMDB access token is not configured.',
        message: 'Please set the VITE_TMDB_ACCESS_TOKEN environment variable in your Vercel project settings.' 
    });
  }

  try {
    const { path: pathParam, ...queryParams } = req.query;

    if (!pathParam) {
      // This case should ideally not be hit with a catch-all route, but as a safeguard:
      return res.status(400).json({ error: 'API path is missing.' });
    }

    const pathSegments = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '');

    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
        } else if (value) {
            searchParams.append(key, value as string);
        }
    });

    const queryString = searchParams.toString();
    const tmdbUrl = `${TMDB_API_BASE_URL}/${pathSegments}${queryString ? `?${queryString}` : ''}`;

    const apiResponse = await fetch(tmdbUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.body,
    });

    const data = await apiResponse.json();

    // Per user instruction, cache for 1 day, stale for 1 hour.
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

    res.status(apiResponse.status).json(data);

  } catch (error: any) {
    console.error('Error in TMDB proxy:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
