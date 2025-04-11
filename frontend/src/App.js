// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarDetailPage from './pages/CarDetailPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import ContactsPage from './pages/ContactsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ReviewsPage from './pages/ReviewsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import HomePage from "./pages/HomePage";
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalog" element={<CatalogPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/car/:id" element={<CarDetailPage />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="/reviews" element={<ReviewsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="*" element={<NotFoundPage />}/>

                            {/* Захищені маршрути */}
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />
                            <Route path="/bookings" element={
                                <ProtectedRoute>
                                    <BookingsPage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;