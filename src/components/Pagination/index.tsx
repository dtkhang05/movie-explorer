import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [jumpToPage, setJumpToPage] = useState('');

  if (totalPages <= 1) return null;

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpToPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage('');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= half + 1) {
      for (let i = 1; i <= maxPagesToShow; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - half) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - half; i <= currentPage + half; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
    >
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-border-color text-text-secondary hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {pageNumbers.map((p, i) =>
          typeof p === 'number' ? (
            <PageButton
              key={i}
              page={p}
              current={currentPage}
              onClick={onPageChange}
            />
          ) : (
            <span key={i} className="px-1 text-text-secondary">
              {p}
            </span>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg border border-border-color text-text-secondary hover:text-primary hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>

      <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
        <input
          type="number"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          placeholder="Go to page..."
          className="w-28 text-sm filter-input"
          min="1"
          max={totalPages}
        />
        <button type="submit" className="btn-secondary text-sm">
          Go
        </button>
      </form>
    </nav>
  );
};

const PageButton: React.FC<{
  page?: number;
  current?: number;
  onClick: (p: number) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}> = ({ page, current, onClick, disabled, children }) => (
  <button
    onClick={() => page && onClick(page)}
    aria-label={children ? undefined : `Page ${page}`}
    aria-current={page === current ? 'page' : undefined}
    disabled={disabled}
    className={`px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
      page === current
        ? 'bg-primary text-white'
        : 'border border-border-color text-text-secondary hover:text-primary hover:border-primary'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children || page}
  </button>
);
