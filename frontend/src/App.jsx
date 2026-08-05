import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh", // full viewport height
      }}
    >
    
      <div
        style={{
          flex: "0 0 10%",
          backgroundColor: "#18245F",
          color: "white",
          padding: "20px",
        }}
      >
        <Navbar />
      </div>

      
      <div
        style={{
          flex: "1", // automatically fills remaining space (70%)
          backgroundColor: "#F5F6FA",
          
          overflowY: "auto", // scroll if content is long
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
