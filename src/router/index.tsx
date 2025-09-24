import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '~/contexts/AuthContext';
import { AppLayout } from '~/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import GasometrosListPage from '~/pages/GasometrosListPage';
import DashboardPage from '~/pages/DashboardPage';
import LoginPage from '~/pages/LoginPage';
import AlertasListPage from '~/pages/AlertasListPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // 1. Redireciona a rota raiz '/' para '/dashboard'
          { index: true, element: <Navigate to="/dashboard" replace /> },
          // 2. Define a rota explícita para o dashboard
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'gasometros', element: <GasometrosListPage /> },
          { path: 'alertas', element: <AlertasListPage /> },
        ],
      },
    ],
  },
]);

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);