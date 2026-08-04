import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products'; 
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;