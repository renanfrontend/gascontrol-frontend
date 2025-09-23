import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GasometrosListPage from '../pages/GasometrosListPage';

const router = createBrowserRouter([
  { path: '/login', element: <div>Página de Login</div> },
  { path: '/', element: <div>Dashboard</div> },
  { path: '/gasometros', element: <GasometrosListPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;