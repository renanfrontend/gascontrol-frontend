import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '~/contexts/AuthContext';
import { AppLayout } from '~/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute'; // Importe a rota protegida
import GasometrosListPage from '~/pages/GasometrosListPage';
import DashboardPage from '~/pages/DashboardPage';
import LoginPage from '~/pages/LoginPage';
import AlertasListPage from '~/pages/AlertasListPage';

const router = createBrowserRouter([
  // Rota pública
  { path: '/login', element: <LoginPage /> },

  // Rotas protegidas
  {
    path: '/',
    element: <ProtectedRoute />, // O portão de entrada
    children: [
      {
        element: <AppLayout />, // O layout que contém as páginas
        children: [
          { index: true, element: <DashboardPage /> },
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