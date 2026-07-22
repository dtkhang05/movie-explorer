import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = '/api/tmdb'; // Trỏ tới proxy function của Vercel
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const PLACEHOLDER_POSTER_URL = '/placeholder-poster.png';
const PLACEHOLDER_BACKDROP_URL = '/placeholder-backdrop.png';
const PLACEHOLDER_PROFILE_URL = '/placeholder-profile.png';

// ─── Axios instance ───────────────────────────────────────────────────────────

/**
 * Cấu hình axios instance cho phía client.
 * Mọi request sẽ được gửi tới proxy function của chúng ta tại `/api/tmdb`
 * thay vì gọi trực tiếp tới TMDB API.
 */
const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default tmdb;

/**
 * Hàm tiện ích để tạo URL đầy đủ cho ảnh poster từ TMDB.
 * Trả về một ảnh placeholder nếu path là null.
 */
export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : PLACEHOLDER_POSTER_URL;

/**
 * Hàm tiện ích để tạo URL đầy đủ cho ảnh backdrop từ TMDB.
 * Trả về một ảnh placeholder nếu path là null.
 */
export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'original') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : PLACEHOLDER_BACKDROP_URL;

/**
 * Hàm tiện ích để tạo URL đầy đủ cho ảnh profile (diễn viên) từ TMDB.
 * Trả về một ảnh placeholder nếu path là null.
 */
export const getProfileUrl = (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'original') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : PLACEHOLDER_PROFILE_URL;