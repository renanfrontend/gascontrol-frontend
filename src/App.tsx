import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from '~/router';

function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;