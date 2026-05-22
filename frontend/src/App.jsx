
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import AppRoutes from './routes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
