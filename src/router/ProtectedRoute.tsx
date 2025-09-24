import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a rota filha (no nosso caso, o AppLayout)
  return <Outlet />;
};