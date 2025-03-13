import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import './App.css';

function App() {
    return (
        <div>
            <h1>ТЕСТОВЫЙ ЗАГОЛОВОК</h1>
            <Router>
                <Routes>
                    <Route path="/" element={<CatalogPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;