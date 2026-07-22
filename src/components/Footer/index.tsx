import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="border-t border-border-color mt-20">
    <div className="container-page py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-secondary text-sm text-center sm:text-left">
          © {new Date().getFullYear()} MovieExplorer. Powered by{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            TMDB
          </a>
          .
        </p>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/favorites" className="hover:text-primary transition-colors">Favorites</Link>
          <Link to="/search" className="hover:text-primary transition-colors">Search</Link>
        </div>
      </div>
    </div>
  </footer>
);
