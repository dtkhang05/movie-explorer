# 🎬 Movie Explorer

A modern, responsive movie discovery web app built with React, TypeScript, and the TMDB API. Browse trending, popular, top-rated, and upcoming movies, search with live filtering, save favorites, and explore detailed movie pages with cast, trailers, and recommendations.

**🔗 Live Demo:** [https://movie-explorer-three-rho.vercel.app/]
**📦 Repository:** [https://github.com/dtkhang05/movie-explorer/tree/main]

---

## 📸 Screenshots

> Add 2–4 screenshots here: Home page (hero + grids), Search page, Movie Detail page, Favorites page, and dark/light mode side-by-side if applicable.

```
<img width="1899" height="2935" alt="Home" src="https://github.com/user-attachments/assets/a3eead7f-8cbb-4e56-b026-f254dccbac26" />

<img width="1899" height="3398" alt="Detail" src="https://github.com/user-attachments/assets/5e6cf50e-4bb7-4504-8bb1-7b002446a5cb" />

<img width="1899" height="2539" alt="Search" src="https://github.com/user-attachments/assets/60d74d45-591b-4c94-adeb-5b39f1f8d8aa" />

```

---

## ✨ Features

- 🔥 **Home** — Hero banner, Trending Today, Popular, Top Rated, and Upcoming sections with infinite scroll
- 🔍 **Search** — Debounced live search with sort by Newest / Oldest / Highest Rating / Popularity
- 🎥 **Movie Detail** — Full info (genres, runtime, budget/revenue, production companies), cast (up to 12), YouTube trailer embed, and similar movies
- ❤️ **Favorites** — Add/remove movies to a favorites list persisted in LocalStorage
- 🌗 **Dark Mode** — Toggle with persisted preference
- ⚡ **Smooth UX** — Skeleton loading states, toast notifications, fade-in animations, and page transitions via Framer Motion
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Core | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Data Fetching | Axios, TanStack Query (React Query) |
| Animation | Framer Motion |
| Notifications | react-hot-toast |
| Persistence | LocalStorage |
| API | [TMDB API](https://www.themoviedb.org/documentation/api) |

---

## 📂 Project Structure

```
src/
├── api/            # Axios instance + TMDB config
├── components/     # Reusable UI components (MovieCard, Navbar, Skeleton...)
├── hooks/          # useFavorites, useInfiniteMovies, useDebounce...
├── layouts/         # App-wide layout, toast container, page transitions
├── pages/          # Home, Search, MovieDetail, Favorites, NotFound
├── services/        # API calls grouped by domain
├── types/           # TypeScript interfaces (Movie, Genre, Cast...)
└── utils/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then add your TMDB API key to .env

# Run the dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
```

---

## 🎯 API Endpoints Used

| Feature | Endpoint |
|---|---|
| Trending | `GET /trending/movie/day` |
| Popular | `GET /movie/popular` |
| Top Rated | `GET /movie/top_rated` |
| Upcoming | `GET /movie/upcoming` |
| Movie Detail | `GET /movie/{id}` |
| Credits | `GET /movie/{id}/credits` |
| Videos | `GET /movie/{id}/videos` |
| Recommendations | `GET /movie/{id}/recommendations` |
| Genres | `GET /genre/movie/list` |
| Search | `GET /search/movie` |

---

## 🗺️ Future Improvements

- User authentication
- Personal watchlist separate from favorites
- User reviews and ratings
- Multi-language support
- PWA support with offline mode
- AI-powered movie recommendations

---

## 📄 License

This project is for educational/portfolio purposes and uses the TMDB API but is not endorsed or certified by TMDB.

---

## 🙏 Acknowledgements

This product uses the TMDB API but is not endorsed or certified by TMDB.
