function ProductCard({
  name,
  type,
  price,
  image,
}) {
  return (
    <div className="product-card">

      <img
        src={image}
        alt={name}
      />

      <h3>{name}</h3>

      <p>{type}</p>

      <strong>{price}</strong>

      <button>+ Add</button>

    </div>
  );
}

export default ProductCard;