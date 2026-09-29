import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import orangeTee from "../assets/back-orange-tshirt.JPG";
import navyHoodie from "../assets/navy-oversize-hoodie.jpeg";
import orangeCrop from "../assets/orange-crop-top.jpeg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 1. HERO BANNER */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tagline">CODE. CONNECT. CREATE</span>
          <h1>
            Your department. <br />
            <span className="brand-orange">Your gear. Your confidence.</span>
          </h1>
          <p className="hero-description">
            Look good, feel good, and represent your department — premium campus apparel built specifically for student life.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Shop Branded Gear
            </button>
            <a href="#about-us" className="btn-secondary">
              Our Purpose
            </a>
          </div>
        </div>
      </section>

      {/* 2. STUDENT DISCOUNT BANNER */}
      <section className="discount-banner" onClick={() => navigate('/products')}>
        <div className="discount-badge">-20% OFF</div>
        <div className="discount-text">
          <h3>Student Discount Auto-Applied</h3>
          <p>Every order qualifies for our 20% departmental discount at checkout.</p>
        </div>
        <button className="discount-btn">Shop Collection →</button>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Gear</h2>
          <p>Explore top picks designed for everyday campus wear</p>
        </div>

        <div className="products-grid">
          {/* Main Large Card */}
          <div className="product-card card-large" onClick={() => navigate('/products')}>
            <div className="card-image-wrap">
              <img src={navyHoodie} alt="Oversized Hoodies" />
              <span className="badge badge-orange">Student Favorite</span>
            </div>
            <div className="card-info">
              <h3>Oversized Hoodies</h3>
              <p>Heavyweight comfort for late-night coding sessions.</p>
              <span className="card-link">Explore Hoodies →</span>
            </div>
          </div>

          {/* Secondary Card 1 */}
          <div className="product-card" onClick={() => navigate('/products')}>
            <div className="card-image-wrap">
              <img src={orangeCrop} alt="Crop Tops" />
              <span className="badge badge-cyan">New Drop</span>
            </div>
            <div className="card-info">
              <h3>Crop Tops</h3>
              <p>Breathable, modern silhouettes built for daily wear.</p>
              <span className="card-link">View Styles →</span>
            </div>
          </div>

          {/* Secondary Card 2 */}
          <div className="product-card" onClick={() => navigate('/products')}>
            <div className="card-image-wrap">
              <img src={orangeTee} alt="ICT Tees" />
              <span className="badge badge-navy">Best Seller</span>
            </div>
            <div className="card-info">
              <h3>ICT Tees</h3>
              <p>Classic departmental signature tees in vibrant orange.</p>
              <span className="card-link">Shop Tees →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRAND PILLARS / ABOUT */}
      <section id="about-us" className="about-section">
        <h2 className="section-title">Why Item Hive</h2>
        <div className="pillars-grid">
          <div className="pillar-card pillar-orange">
            <span className="pillar-stat">-20%</span>
            <h3>Built for Student Budgets</h3>
            <p>Affordable, high-quality T-shirts designed for daily wear — so your funds stretch further.</p>
          </div>

          <div className="pillar-card pillar-cyan">
            <span className="pillar-stat">100%</span>
            <h3>One ICT Identity</h3>
            <p>Apparel that unites the department under a common look — pride and connection, on and off campus.</p>
          </div>

          <div className="pillar-card pillar-navy">
            <span className="pillar-stat">#1</span>
            <h3>Customer First, Always</h3>
            <p>Simple, safe, reliable software built around what our student community actually needs.</p>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="cta-section">
        <h2>Ready to Represent Your Department?</h2>
        <p>Explore our latest ICT apparel collection designed for everyday student life.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Explore Products
          </button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            Sign In / Register
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;