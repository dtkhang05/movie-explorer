import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '../SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { useGenres } from '../../hooks/useMovies';

const FilmIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);
const MenuIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

const popularLanguages = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }, { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }, { code: 'cn', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
];

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { data: allGenres = [] } = useGenres();
  const navigate = useNavigate();

  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [releaseDateGte, setReleaseDateGte] = useState('');
  const [releaseDateLte, setReleaseDateLte] = useState('');
  const [language, setLanguage] = useState('');
  const [score, setScore] = useState(0);
  const [runtime, setRuntime] = useState([0, 300]);

  useEffect(() => {
    if (filtersOpen || mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen, mobileOpen]);

  const handleGenreToggle = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setReleaseDateGte('');
    setReleaseDateLte('');
    setLanguage('');
    setScore(0);
    setRuntime([0, 300]);
  };

  const handleApplyFilters = () => {
    setFiltersOpen(false);
    setMobileOpen(false);
    const params = new URLSearchParams();
    if (selectedGenres.length > 0) params.set('with_genres', selectedGenres.join(','));
    if (releaseDateGte) params.set('primary_release_date.gte', releaseDateGte);
    if (releaseDateLte) params.set('primary_release_date.lte', releaseDateLte);
    if (language) params.set('with_original_language', language);
    if (score > 0) params.set('vote_average.gte', score.toString());
    if (runtime[0] > 0) params.set('with_runtime.gte', runtime[0].toString());
    if (runtime[1] < 300) params.set('with_runtime.lte', runtime[1].toString());
    navigate({ pathname: '/discover', search: params.toString() });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-primary' : isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-slate-500 hover:text-slate-900'
    }`;

  const FilterModalContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Discover Filters</h2>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Row 1: Genres */}
          <div>
            <label className="filter-label mb-3">Genres</label>
            <div className="flex flex-wrap gap-2">
              {allGenres.map((g) => (
                <button key={g.id} onClick={() => handleGenreToggle(g.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                    selectedGenres.includes(g.id)
                      ? 'bg-primary text-white border-primary'
                      : 'border-border bg-card hover:border-accent hover:text-accent'
                  }`}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Row 2: Other Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
            <div>
              <label className="filter-label">Release Dates</label>
              <div className="flex flex-col gap-4">
                <input type="date" aria-label="Release After" placeholder="From" value={releaseDateGte} onChange={e => setReleaseDateGte(e.target.value)} className="filter-input" />
                <input type="date" aria-label="Release Before" placeholder="To" value={releaseDateLte} onChange={e => setReleaseDateLte(e.target.value)} className="filter-input" />
              </div>
            </div>
            <div>
              <label htmlFor="language" className="filter-label">Language</label>
              <select id="language" value={language} onChange={e => setLanguage(e.target.value)} className="filter-input">
                <option value="">Any</option>
                {popularLanguages.map(lang => (<option key={lang.code} value={lang.code}>{lang.name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="user-score" className="filter-label">Min. User Score: {score}</label>
              <input id="user-score" type="range" min="0" max="10" step="0.5" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full accent-primary mt-3" />
            </div>
            <div>
              <label className="filter-label">Runtime (minutes)</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Min" min="0" value={runtime[0]} onChange={e => setRuntime([+e.target.value, runtime[1]])} className="filter-input" />
                <input type="number" placeholder="Max" min="0" value={runtime[1]} onChange={e => setRuntime([runtime[0], +e.target.value])} className="filter-input" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-border flex items-center gap-4">
        <button onClick={handleClearFilters} className="flex-1 btn-secondary">
          Clear Filters
        </button>
        <button onClick={handleApplyFilters} className="flex-1 btn-primary">
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className={`sticky top-0 z-40 backdrop-blur-md navbar-bg`}>
        <div className="container-page">
          <nav className="flex items-center h-16 gap-4">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
              <FilmIcon />
              <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                Movie<span className="text-primary">Explorer</span>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/favorites" className={navLinkClass}><HeartIcon /> Favorites</NavLink>
              <button onClick={() => setFiltersOpen(true)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${isDark ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-slate-500 hover:text-slate-900'}`}>
                <FilterIcon /> Filters
              </button>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:block w-56 md:w-72">
              <SearchBar compact />
            </div>
            <button onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className={`p-2 rounded-lg transition-all duration-200 ${isDark ? 'text-[#94A3B8] hover:text-yellow-400 hover:bg-[#1E293B]' : 'text-slate-500 hover:text-primary hover:bg-slate-100'}`} id="theme-toggle">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setMobileOpen((o) => !o)} className={`sm:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-[#94A3B8] hover:text-primary hover:bg-[#1E293B]' : 'text-slate-500 hover:text-primary hover:bg-slate-100'}`} aria-label="Toggle menu" aria-expanded={mobileOpen}>
              <MenuIcon open={mobileOpen} />
            </button>
          </nav>
          {mobileOpen && (
            <div className={`sm:hidden pb-4 flex flex-col gap-4 border-t pt-4 ${isDark ? 'border-[#334155]' : 'border-slate-200'}`}>
              <SearchBar placeholder="Search movies…" />
              <div className="flex flex-wrap gap-3">
                <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
                <NavLink to="/favorites" className={navLinkClass} onClick={() => setMobileOpen(false)}><HeartIcon /> Favorites</NavLink>
                <button onClick={() => { setMobileOpen(false); setFiltersOpen(true); }} className={navLinkClass({isActive:false})}><FilterIcon /> Filters</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setFiltersOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`relative rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[85vh] ${isDark ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <FilterModalContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};