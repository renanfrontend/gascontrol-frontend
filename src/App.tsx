import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from '~/router';

function App() {
  return (
    <div className="dark">
      {/* O AppRouter precisa estar dentro do AuthProvider */}
      <AppRouter />
    </div>
  );
}

export default App;