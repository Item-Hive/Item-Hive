function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#18245F",
        color: "white",
        borderRadius: "12px",
        border: "none",
        padding: "12px 25px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default Button;