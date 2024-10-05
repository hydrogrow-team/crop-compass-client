import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('~/lib/pages/home'));
const Dashboard = React.lazy(() => import('~/lib/pages/dashboard'));
const Login = React.lazy(() => import('~/lib/pages/auth/login'));
const SignUp = React.lazy(() => import('~/lib/pages/auth/signup'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/signup',
    element: <SignUp />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
];
