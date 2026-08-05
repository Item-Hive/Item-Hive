import React from "react";
import "./COLOR.CSS"; // Make sure the path points to where your CSS file is stored

function BrandGuidelines() {
  return (
    <div className="brand-guidelines-container">
      {/* ===================== COLOR EXPLANATION ===================== */}
      <section className="page">
        <header className="page__header">
          <h1>Color explanation</h1>
          <p>
            Our color palette is carefully designed to reflect our brand
            identity, evoke the right emotions, and ensure a consistent visual
            experience.
          </p>
        </header>

        <div className="panel">
          <h2 className="panel__title">Corporate Colors</h2>
          <div className="grid grid--3">
            <div className="swatch" style={{ background: "#0097B2" }}>
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#0097B2</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">100%, 15%, 0%, 30%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">0,198,204</span>
            </div>
            <div className="swatch" style={{ background: "#FF7F1F" }}>
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#FF7F1F</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">0%, 54%, 88%, 0%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">255,127,31</span>
            </div>
            <div className="swatch" style={{ background: "#101D50" }}>
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#101D50</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">81%, 66%, 0%, 66%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">16,29,80</span>
            </div>
          </div>
        </div>

        <div className="panel panel--secondary">
          <h2 className="panel__title panel__title--light">Secondary Colors</h2>
          <div className="grid grid--3">
            <div
              className="swatch swatch--dark-text"
              style={{ background: "#B7C3C6" }}
            >
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#0097B2</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">0%, 0%, 0%, 20%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">204,204,204</span>
            </div>
            <div
              className="swatch swatch--dark-text"
              style={{ background: "#FFFFFF" }}
            >
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#FFFFFF</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">0%, 0%, 0%, 0%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">255,255,255</span>
            </div>
            <div className="swatch" style={{ background: "#000000" }}>
              <span className="swatch__label">HEX CODE:</span>
              <span className="swatch__value">#000000</span>
              <span className="swatch__label">CMYK:</span>
              <span className="swatch__value">0%, 0%, 0%, 100%</span>
              <span className="swatch__label">RGB:</span>
              <span className="swatch__value">0,0,0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BRAND TYPOGRAPHY ===================== */}
      <section className="page">
        <header className="page__header">
          <h1>Brand Typography</h1>
          <p>
            Our typography system is designed to ensure clarity, consistency,
            and a strong visual hierarchy across all communication.
          </p>
        </header>

        <div className="panel">
          <div className="grid grid--2">
            <div className="type-item">
              <div className="type-item__icon">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#1a8fc7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 40c0-1.7 1.3-3 3-3h1V25.5a2 2 0 0 1 4 0V35" />
                  <path d="M21 35v-11a2 2 0 0 1 4 0v11" />
                  <path d="M25 35v-9.5a2 2 0 0 1 4 0V35" />
                  <path d="M29 35v-7a2 2 0 0 1 4 0v3.2" />
                  <path d="M17 37v6.5c0 5.2 4.1 9.3 9.2 9.3h5.6c5.1 0 9.2-4.1 9.2-9.3v-4.3c0-2.4-1.9-4.3-4.3-4.3H33" />
                  <circle cx="47" cy="15" r="8" />
                  <text
                    x="47"
                    y="18.5"
                    fontFamily="Arial, sans-serif"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                    stroke="none"
                    fill="#1a8fc7"
                  >
                    %
                  </text>
                </svg>
              </div>
              <div className="type-item__content">
                <h3>MAIN HEADINGS</h3>
                <ul>
                  <li>
                    Font name: <span className="accent">Helvetica</span>
                  </li>
                  <li>
                    World Size: <span className="accent">60</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="type-item">
              <div className="type-item__icon">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#1a8fc7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 34a18 18 0 0 1 36 0v4" />
                  <rect x="10" y="32" width="9" height="16" rx="4.5" />
                  <rect x="45" y="32" width="9" height="16" rx="4.5" />
                  <path d="M49.5 48v3a7 7 0 0 1-7 7h-5" />
                  <circle cx="35.5" cy="58" r="2.3" />
                </svg>
              </div>
              <div className="type-item__content">
                <h3>BODY CONTEXT</h3>
                <ul>
                  <li>
                    Font name: <span className="accent">Source Sans</span>
                  </li>
                  <li>
                    Pro Size: <span className="accent">21</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="type-item">
              <div className="type-item__icon">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#1a8fc7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="32" cy="16" r="6" />
                  <g strokeWidth="2.2">
                    <line x1="32" y1="6" x2="32" y2="9.5" />
                    <line x1="32" y1="22.5" x2="32" y2="26" />
                    <line x1="22" y1="16" x2="25.5" y2="16" />
                    <line x1="38.5" y1="16" x2="42" y2="16" />
                    <line x1="24.9" y1="8.9" x2="27.3" y2="11.3" />
                    <line x1="36.7" y1="20.7" x2="39.1" y2="23.1" />
                    <line x1="39.1" y1="8.9" x2="36.7" y2="11.3" />
                    <line x1="27.3" y1="20.7" x2="24.9" y2="23.1" />
                  </g>
                  <circle cx="16" cy="38" r="5.5" />
                  <path d="M6 56v-3c0-5 4.5-9 10-9s10 4 10 9v3" />
                  <circle cx="32" cy="42" r="5.5" />
                  <path d="M22 58v-2.5c0-5 4.5-9 10-9s10 4 10 9V58" />
                  <circle cx="48" cy="38" r="5.5" />
                  <path d="M38 56v-3c0-5 4.5-9 10-9s10 4 10 9v3" />
                </svg>
              </div>
              <div className="type-item__content">
                <h3>SUB-HEADING</h3>
                <ul>
                  <li>
                    Name: <span className="accent">Source</span>
                  </li>
                  <li>
                    Sans Size: <span className="accent">23</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="type-item">
              <div className="type-item__icon">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#1a8fc7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="32" cy="14" r="6.5" />
                  <g strokeWidth="2.2">
                    <line x1="32" y1="3.5" x2="32" y2="7.2" />
                    <line x1="32" y1="20.8" x2="32" y2="24.5" />
                    <line x1="21.5" y1="14" x2="25.2" y2="14" />
                    <line x1="38.8" y1="14" x2="42.5" y2="14" />
                    <line x1="24.3" y1="6.3" x2="26.8" y2="8.8" />
                    <line x1="37.2" y1="19.2" x2="39.7" y2="21.7" />
                    <line x1="39.7" y1="6.3" x2="37.2" y2="8.8" />
                    <line x1="26.8" y1="19.2" x2="24.3" y2="21.7" />
                  </g>
                  <path d="M32 24.5v9M32 33.5l-16 10M32 33.5l16 10" />
                  <circle cx="16" cy="47" r="5.5" />
                  <path d="M6 60.5v-2c0-5 4.5-9 10-9s10 4 10 9v2" />
                  <circle cx="48" cy="47" r="5.5" />
                  <path d="M38 60.5v-2c0-5 4.5-9 10-9s10 4 10 9v2" />
                </svg>
              </div>
              <div className="type-item__content">
                <h3>ALTERNATIVE</h3>
                <ul>
                  <li>
                    Font name: <span className="accent">Chunky</span>
                  </li>
                  <li>
                    Five Size: <span className="accent">60</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BrandGuidelines;