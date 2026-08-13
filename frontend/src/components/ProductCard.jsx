import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const {
    name = "ItemHive Tee",
    color = "White",
    description = "Official ICT department apparel.",
    price = 200,
    sizes = "S, M, L, XL",
    rating = 4.5,
    image
  } = product || {};

  return (
    <div 
      className="product-card"
      style={{
        backgroundColor: '#1E293B', // Dark slate card container
        borderRadius: '16px',
        padding: '16px',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '280px',
        border: '1px solid #334155', // Subtle slate border
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        {/* Product Image Container */}
        <div style={{ 
          width: '100%', 
          height: '220px', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          marginBottom: '14px',
          position: 'relative',
          backgroundColor: '#0F172A'
        }}>
          <img
            src={image || 'https://via.placeholder.com/280x220?text=ItemHive+Product'}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Rating Badge Overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: '600',
            color: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ color: '#FBBF24' }}>★</span> {rating}
          </div>
        </div>

        {/* Product Details */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#F8FAFC', margin: '0 0 6px 0' }}>
          {name}
        </h3>
        
        {description && (
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '0 0 12px 0', lineHeight: '1.4', minHeight: '36px' }}>
            {description}
          </p>
        )}

        {/* Attributes (Color & Sizes Tags) */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={tagStyle}>
            <strong style={{ color: '#64748B', marginRight: '4px' }}>Color:</strong> {color}
          </span>
          <span style={tagStyle}>
            <strong style={{ color: '#64748B', marginRight: '4px' }}>Sizes:</strong> {sizes}
          </span>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: '12px',
        borderTop: '1px solid #334155',
        marginTop: '8px'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>
            Price
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FF751F' }}>
            R{price}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) onAddToCart(e);
          }}
          style={{
            backgroundColor: '#FF751F', // Signature ItemHive Orange
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 117, 31, 0.25)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E05A00'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF751F'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const tagStyle = {
  backgroundColor: '#0F172A',
  border: '1px solid #334155',
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: '0.75rem',
  color: '#CBD5E1'
};

export default ProductCard;