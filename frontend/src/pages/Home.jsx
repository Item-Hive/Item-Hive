import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import whiteTee from "../assets/back-white-tshirt.JPG";
import orangeTee from "../assets/back-orange-tshirt.JPG";
import navyHoodie from "../assets/navy-oversize-hoodie.jpeg";
import orangeCrop from "../assets/orange-crop-top.jpeg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* PROMO STRIP */}
      <section className="promo-strip">
        <div className="promo-block promo-large" onClick={() => navigate('/products')}>
          <img src={navyHoodie} alt="Oversized Hoodies" className="promo-img" />
          <div className="promo-overlay" />
          <div className="promo-content">
            <span className="promo-eyebrow">Student Favorite</span>
            <h2>Oversized Hoodies</h2>
            <button className="promo-link">Shop now →</button>
          </div>
        </div>

        <div className="promo-stack">
          <div className="promo-block promo-discount" onClick={() => navigate('/products')}>
            <span className="promo-percent">-20%</span>
            <span className="promo-caption">Student discount, applied automatically at checkout</span>
          </div>

          <div className="promo-block" onClick={() => navigate('/products')}>
            <img src={orangeCrop} alt="Crop Tops" className="promo-img" />
            <div className="promo-overlay" />
            <div className="promo-content">
              <span className="promo-eyebrow">New Drop</span>
              <h3>Crop Tops</h3>
            </div>
          </div>

          <div className="promo-block" onClick={() => navigate('/products')}>
            <img src={orangeTee} alt="ICT Tees" className="promo-img" />
            <div className="promo-overlay" />
            <div className="promo-content">
              <span className="promo-eyebrow">Best Seller</span>
              <h3>ICT Tees</h3>
            </div>
          </div>
        </div>
      </section>

      {/* HERO / BRAND STATEMENT */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Your department. <span className="brand-orange">Your gear. Your confidence.</span>
          </h1>
          <p className="hero-tagline">CODE. CONNECT. CREATE</p>
          <p className="hero-description">
            Look good, feel good, and represent your department — without breaking the bank.
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

      {/* ABOUT / PILLARS */}
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

      {/* CTA SECTION */}
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