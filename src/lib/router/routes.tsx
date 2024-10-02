import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('~/lib/pages/home'));

export const routes: Array<PathRouteProps> = [
];

export const privateRoutes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />
  }
];
