import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../assets/item-hive-logo.jpeg'; // 

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {}
      <section className="hero-section">
        <div className="hero-content">
          <img src={logo} alt="Item Hive Logo" className="home-logo" />
          <h1>
            Welcome to <span className="brand-orange">Item Hive</span>
          </h1>
          <p className="hero-tagline">CODE. CONNECT. CREATE</p>
          <p className="hero-description">
            Empowering ICT students with affordable, high-quality branded apparel—building unity, department pride, and everyday confidence on campus.
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

      {}
      <section className="value-prop-section">
        <div className="value-prop-card">
          <h2>Our Purpose & Impact</h2>
          <p>
            Item Hive aids financially disadvantaged ICT students by offering high-quality T-shirts designed for daily wear throughout the school year. By reducing apparel costs, students can stretch their restricted funds for critical academic needs.
          </p>
          <p>
            Beyond affordability, our apparel unites members of the ICT department under a common identity, fostering pride and strong peer connections across campus.
          </p>
        </div>
      </section>

      {}
      <section id="about-us" className="about-section">
        <h2 className="section-title">About Item Hive</h2>
        
        <div className="pillars-grid">
          {/* Mission */}
          <div className="pillar-card">
            <div className="pillar-header orange">
              <h3>Mission</h3>
            </div>
            <p>
              Provide a simple, dependable platform enabling our customers to purchase our ICT branded products easily and without effort.
            </p>
          </div>

          {/* Vision */}
          <div className="pillar-card">
            <div className="pillar-header cyan">
              <h3>Vision</h3>
            </div>
            <p>
              Become a top brand in South Africa, built on reliable, simple, safe, and accessible software that addresses all of our customers' needs.
            </p>
          </div>

          {}
          <div className="pillar-card">
            <div className="pillar-header navy">
              <h3>Values</h3>
            </div>
            <ul className="values-list">
              <li>
                <strong>Customer First:</strong> We value customer needs above profit.
              </li>
              <li>
                <strong>Usability & Simplicity:</strong> We prioritize effortless usability and reliability over complex aesthetics.
              </li>
              <li>
                <strong>Safety & Trust:</strong> We safeguard the interests and security of our student community.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {}
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