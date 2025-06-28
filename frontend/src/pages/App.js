import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import '../styles/Navbar.css';

function App() {
  return (
    <DataProvider>
      <nav className="navbar">
        <span className="site-title">TEST4</span>
        <Link to="/" className="nav-link">Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;