import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const {
    name = "ItemHive Tee",
    color = "White",
    description = "",
    price = 200,
    sizes = "S, M, L, XL",
    rating = 4.5,
    image
  } = product || {};

  return (
    <div style={{
      backgroundColor: '#0a1931', // Deep navy background
      borderRadius: '8px',
      padding: '16px',
      color: '#ffffff',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'space-between',
      width: '280px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      {/* Product Image */}
      <div style={{ width: '100%', height: '260px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
        <img
          src={image || 'https://via.placeholder.com/280x260?text=Product+Image'}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Details */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '4px 0' }}>{name}</h3>
      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '2px 0' }}><strong>Color:</strong> {color}</p>
      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '6px 0', lineHeight: '1.2' }}>{description}</p>
      
      <p style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '4px 0' }}><strong>Price:</strong> R{price}</p>
      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '2px 0' }}><strong>Sizes:</strong> {sizes}</p>
      
      <p style={{ fontSize: '0.85rem', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <strong>Rating:</strong> <span style={{ color: '#fbbf24' }}>★</span> {rating}
      </p>

      {/* Action Button */}
      <button
        onClick={() => onAddToCart && onAddToCart(product)}
        style={{
          backgroundColor: '#ff7a00', // Vibrant orange
          color: '#ffffff',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px',
          transition: 'background-color 0.2s'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;