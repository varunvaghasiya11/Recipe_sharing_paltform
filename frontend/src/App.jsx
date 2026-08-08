import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeFormPage from './pages/RecipeFormPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/create" element={<RecipeFormPage />} />
                <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }} className="animate-fade-in">
                  <span style={{ fontSize: '3rem' }}>🔍</span>
                  <h2 className="serif-title" style={{ fontSize: '2rem', marginTop: '1rem' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>We couldn't find the page you were looking for.</p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Go Back Home</a>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
