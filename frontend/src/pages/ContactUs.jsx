import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "../styles/ContactUs.css";

const USER_KEY = "ict_branded_user";

// EmailJS (same service + template as the order confirmation email)
const EMAILJS_SERVICE_ID = "service_yreimln";
const EMAILJS_TEMPLATE_ID = "template_x8vi8e9";
const EMAILJS_PUBLIC_KEY = "l4ZIEzZgbcdQwSqW6";
const SUPPORT_EMAIL = "itemhive.noreply@gmail.com";

const SUBJECTS = [
  "General Question",
  "Order Issue",
  "Sizing / Fit Help",
  "Delivery / PAXI Question",
  "Partnership / Bulk Order",
  "Other",
];

// TODO: replace the phone number with your real one
const CONTACT_INFO = [
  { label: "Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
  { label: "Phone", value: "+27 00 000 0000", href: "tel:+270000000000" },
  { label: "Campus", value: "CPUT Bellville Campus, Cape Town" },
];

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export default function ContactUs() {
  const user = getLoggedInUser();

  const [name, setName] = useState(
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const formValid =
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    subject &&
    message.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: SUPPORT_EMAIL,
          reply_to: email.trim(),
          subject: `Contact form: ${subject}`,
          message:
            `From: ${name.trim()} (${email.trim()})\n` +
            `Topic: ${subject}\n\n` +
            message.trim(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit contact message:", err);
      setSubmitError(
        "Something went wrong sending your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-content-container">
          <div className="contact-section-card contact-confirm-card">
            <div className="confirm-emoji">✅</div>
            <h2 className="confirm-title">Message Sent</h2>
            <p className="confirm-detail">
              Thanks, <strong>{name}</strong>! We've received your message and
              will get back to you at <strong>{email}</strong> soon.
            </p>
            <Link className="contact-primary-btn" to="/products">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-top-label">Get in Touch</div>

      <div className="contact-hero-banner">
        <div className="hero-top-bar">
          <span className="hero-brand">
            Item <span className="brand-orange">Hive</span>
          </span>
          <Link className="hero-right-label" to="/products">
            ← Back to Shop
          </Link>
        </div>

        <div className="hero-user-info">
          <h2 className="user-name">Contact Us</h2>
          <p className="user-subtext">
            Questions, order issues, or feedback — we'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="contact-content-container">
        <div className="contact-section-card">
          <div className="card-header-bar">Reach Us Directly</div>
          <div className="card-body contact-info-grid">
            {CONTACT_INFO.map((info) => (
              <div className="contact-info-item" key={info.label}>
                <span className="settings-label">{info.label}</span>
                {info.href ? (
                  <a className="contact-info-value link" href={info.href}>
                    {info.value}
                  </a>
                ) : (
                  <span className="contact-info-value">{info.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="contact-section-card">
            <div className="card-header-bar">Send Us a Message</div>
            <div className="card-body settings-list">
              <div className="form-field">
                <label className="settings-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="contact-input"
                  placeholder="e.g. Thandi Nkosi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="settings-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="contact-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="settings-label" htmlFor="subject">
                  Subject
                </label>
                <select
                  id="subject"
                  className="contact-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select a topic</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="settings-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="contact-textarea"
                  placeholder="Tell us what's up (at least 10 characters)..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {submitError && <p className="error-text">{submitError}</p>}

          <div className="contact-submit-wrapper">
            <button
              type="submit"
              className="contact-primary-btn"
              disabled={!formValid || submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
