import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '~/components/layout/AppLayout';
import GasometrosListPage from '~/pages/GasometrosListPage';
import DashboardPage from '~/pages/DashboardPage';
import LoginPage from '~/pages/LoginPage';
import AlertasListPage from '~/pages/AlertasListPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'gasometros', element: <GasometrosListPage /> },
      { path: 'alertas', element: <AlertasListPage /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;