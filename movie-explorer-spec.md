# Movie Explorer — Project Spec (v1.0)

## 0. Mục tiêu & Định vị
- Portfolio project cho vị trí **Frontend Intern**, ưu tiên chất lượng code sạch + demo chạy thật hơn là nhồi nhét tính năng.
- Web app khám phá phim qua **TMDB API**: xem phim nổi bật, tìm kiếm, xem chi tiết, lưu yêu thích, lọc theo thể loại.
- Deliverable cuối: repo GitHub sạch + demo Vercel + README có ảnh chụp màn hình.

## 1. Tech Stack

| Nhóm | Công nghệ | Ghi chú |
|---|---|---|
| Core | React 19 + TypeScript + Vite | |
| Style | Tailwind CSS | |
| Routing | React Router v6 | |
| Data fetching | Axios + TanStack Query (React Query) | cache, loading, error tự động |
| Animation | Framer Motion | dùng có chọn lọc, đừng lạm dụng |
| Form (nếu cần filter nâng cao) | React Hook Form + Zod | không bắt buộc phase 1 |
| Persist | LocalStorage | favorites + theme |

**Lưu ý khi code:** đừng cài hết mọi thứ ngay từ đầu. Phase 1 chỉ cần React Router + Axios + React Query + Tailwind là đủ chạy.

## 2. Cấu trúc thư mục
```
src/
├── api/
│   └── tmdb.ts              # axios instance + base URL + API key
├── assets/
├── components/
│   ├── Navbar/
│   ├── Footer/
│   ├── MovieCard/
│   ├── SearchBar/
│   ├── GenreBadge/
│   ├── Skeleton/
│   ├── Pagination/
│   └── LoadingSpinner/
├── hooks/                    # useMovies, useFavorites, useDebounce...
├── layouts/
├── pages/
│   ├── Home/
│   ├── Search/
│   ├── MovieDetail/
│   ├── Favorites/
│   └── NotFound/
├── services/                  # gọi API theo domain (movieService.ts)
├── types/                     # Movie, Genre, Cast, Video...
├── utils/
├── routes/
├── App.tsx
└── main.tsx
```

## 3. Routing
| Path | Trang |
|---|---|
| `/` | Home |
| `/search` | Search |
| `/movie/:id` | Movie Detail |
| `/favorites` | Favorites |
| `*` | 404 |

## 4. Data Model (types/)
```ts
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  genres: Genre[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

interface Genre { id: number; name: string; }

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  key: string;   // youtube key
  site: string;  // "YouTube"
  type: string;  // "Trailer"
}
```

## 5. API Layer (TMDB)

Base URL: `https://api.themoviedb.org/3`
Auth: Bearer token (v4) hoặc `api_key` query param (v3) — để trong `.env`, KHÔNG commit key.

| Chức năng | Endpoint |
|---|---|
| Trending | `GET /trending/movie/day` |
| Popular | `GET /movie/popular` |
| Top Rated | `GET /movie/top_rated` |
| Upcoming | `GET /movie/upcoming` |
| Movie Detail | `GET /movie/{id}` |
| Credits (cast) | `GET /movie/{id}/credits` |
| Videos (trailer) | `GET /movie/{id}/videos` |
| Recommendations | `GET /movie/{id}/recommendations` |
| Genres list | `GET /genre/movie/list` |
| Search | `GET /search/movie?query=` |

Ảnh poster: `https://image.tmdb.org/t/p/w500{poster_path}`

## 6. Trang & Tính năng chi tiết

### 6.1 Navbar
- Logo "Movie Explorer"
- Menu: Home / Favorites
- Search box (rút gọn, click mở rộng trên mobile)
- Dark mode toggle
- Responsive hamburger menu

### 6.2 Home
- **Hero section**: backdrop phim nổi bật + nút "View Detail"
- **Trending Today**: grid 8 phim
- **Popular**: grid 12 phim + nút "Load More"
- **Top Rated**: grid 12 phim
- **Upcoming**: grid 12 phim

### 6.3 Search
- Input debounce 500ms → gọi API `/search/movie`
- Filter: sort theo Newest / Oldest / Highest Rating / Popularity
- Empty state khi không có kết quả
- Skeleton khi đang load

### 6.4 Movie Detail
- Backdrop lớn + poster + title + rating + genres + runtime + release date + overview
- Budget / Revenue / Status / Production companies
- Cast: tối đa 12 diễn viên (avatar, tên, vai diễn)
- Trailer: embed YouTube nếu có, ẩn section nếu không có
- Similar Movies: grid 8 phim
- Nút Favorite (Add/Remove, đổi trạng thái ngay lập tức — optimistic UI)

### 6.5 Favorites
- Đọc từ LocalStorage, hiển thị grid MovieCard
- Empty state nếu chưa có phim yêu thích nào

### 6.6 MovieCard (component dùng lại khắp nơi)
- Poster, title, rating, release year
- Hover: scale + shadow
- Nút favorite (icon trái tim) trên card, không cần vào detail mới add được

## 7. State Management
- **TanStack Query**: toàn bộ data từ TMDB (cache, loading, error, refetch)
- **React state (useState/useContext)**: theme, search input, modal
- **LocalStorage**: favorites list, theme preference (đọc/ghi qua custom hook `useFavorites`, `useTheme`)

## 8. Loading / Error / Empty States
- Skeleton loader riêng cho: MovieCard grid, Movie Detail, Search results
- Error: hiển thị UI thân thiện + nút Retry khi API lỗi hoặc mất mạng
- 404: trang riêng cho route không tồn tại
- Empty state: khi search không ra kết quả, khi favorites rỗng

## 9. Design System
| Token | Giá trị |
|---|---|
| Background | `#0F172A` |
| Primary | `#2563EB` |
| Secondary | `#64748B` |
| Card | `#1E293B` |
| Text | `#F8FAFC` |
| Font | Inter |
| Border radius | 16px |
| Shadow | soft |

Dark mode là default theme; light mode optional nếu kịp thời gian.

## 10. Animation (Framer Motion) — dùng vừa đủ
- Fade in khi card xuất hiện
- Page transition giữa các route
- Hover scale trên MovieCard và button

## 11. Non-functional
- Responsive: Desktop / Tablet / Mobile
- Lazy load ảnh poster/backdrop
- SEO: đặt `<title>` động theo từng trang (dùng `document.title` hoặc react-helmet nhẹ)
- Accessibility cơ bản: alt text cho ảnh, semantic HTML, keyboard nav cho search

## 12. Roadmap ưu tiên (để kịp deadline CV)

**Phase 1 — Bắt buộc (Day 1–2)**
- [ ] Setup project (Vite + TS + Tailwind + Router)
- [ ] API layer + types
- [ ] Home (Trending/Popular/Top Rated/Upcoming)
- [ ] Movie Detail
- [ ] Search
- [ ] Favorites (LocalStorage)
- [ ] Responsive cơ bản

**Phase 2 (Day 3)**
- [ ] Dark mode
- [ ] Skeleton loading
- [ ] Trailer embed
- [ ] Similar movies

**Phase 3 (Day 4 — nếu còn thời gian)**
- [ ] Framer Motion animations
- [ ] Toast notification (react-hot-toast) khi add/remove favorite
- [ ] Infinite scroll thay cho Load More
- [ ] Polish UI, fix responsive edge cases

**Phase 4 (Day 5 — deploy & trình bày)**
- [ ] Deploy Vercel
- [ ] README: giới thiệu, tech stack, cài đặt, ảnh chụp màn hình, API sử dụng, tính năng, hướng phát triển
- [ ] Clean commit history / .env.example (không commit API key thật)

## 13. Hướng phát triển tương lai (ghi trong README, không code)
- Authentication, Watchlist, Reviews, Multi-language, PWA/offline, AI recommendation

---
**Note để code (vibe coding):** làm theo đúng thứ tự Phase 1 → 4, đừng nhảy cóc sang animation/toast khi Home + Detail + Search + Favorites chưa chạy ổn định. Ưu tiên: chạy được > đẹp > mượt.
