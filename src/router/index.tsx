import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '~/contexts/AuthContext';
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

export const AppRouter = () => 
<AuthProvider>
<RouterProvider router={router} />;
</AuthProvider>