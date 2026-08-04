import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Checkout from './pages/Checkout';

function App() {
  return (
    <div className="app-container">
      {}
      <Navbar />

      {}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      {}
      <Footer />
    </div>
  );
}

export default App;