import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookDetailPage from './pages/BookDetailPage';
import ApiTestPage from './pages/ApiTestPage';

// Import components
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/api-test" element={<ApiTestPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />
            <Route path="/books/:id" element={
              <PrivateRoute>
                <BookDetailPage />
              </PrivateRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
