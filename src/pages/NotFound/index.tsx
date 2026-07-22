import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container-page flex flex-col items-center justify-center min-h-[70vh] text-center py-16">
      <div className="text-8xl font-black text-primary mb-4 opacity-40 select-none">404</div>
      <h1 className="text-3xl font-bold text-text-primary mb-3">Page Not Found</h1>
      <p className="text-text-secondary max-w-sm mb-8">
        The page you're looking for doesn't exist or the movie has gone offline.
      </p>
      <Link to="/" className="btn-primary">
        ← Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
