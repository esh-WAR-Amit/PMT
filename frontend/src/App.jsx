import './App.css';
import '@mantine/core/styles.css';
import "@mantine/dates/styles.css";
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import AppLayout from './pages/AppLayout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/LoginPage';

function App() {

  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<PrivateRoute><AppLayout /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
