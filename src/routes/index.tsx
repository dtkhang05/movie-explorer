import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { PageLoader } from '../components/LoadingSpinner';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const MovieDetail = lazy(() => import('../pages/MovieDetail'));
const Favorites = lazy(() => import('../pages/Favorites'));
const GenrePage = lazy(() => import('../pages/Genre'));
const Discover = lazy(() => import('../pages/Discover'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ErrorPage = lazy(() => import('../pages/Error'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: withSuspense(ErrorPage),
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'search', element: withSuspense(Search) },
      { path: 'movie/:id', element: withSuspense(MovieDetail) },
      { path: 'favorites', element: withSuspense(Favorites) },
      { path: 'genre/:id', element: withSuspense(GenrePage) },
      { path: 'discover', element: withSuspense(Discover) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
]);
