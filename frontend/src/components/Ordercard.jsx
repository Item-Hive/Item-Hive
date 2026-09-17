function OrderCard({
  order,
}) {
  return (
    <div className="order-card">

      <div>

        <h3>
          Order #{order.id}
        </h3>

        <p>{order.product}</p>

      </div>

      <strong>
        {order.price}
      </strong>

    </div>
  );
}

export default OrderCard;