function SectionHeader({ title }) {
  return (
    <div
      style={{
        background: "#18245F",
        color: "white",
        padding: "14px",
        borderRadius: "12px",
        fontWeight: "bold",
        marginBottom: "15px",
      }}
    >
      {title}
    </div>
  );
}

export default SectionHeader;
