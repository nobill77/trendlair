export default function SkeletonCard() {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem",
      background: "linear-gradient(135deg, #141820 0%, #0f1117 60%, #111418 100%)",
      display: "flex", flexDirection: "column", gap: "12px", height: "200px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="skeleton" style={{ width: "40px", height: "14px" }} />
          <div className="skeleton" style={{ width: "80px", height: "14px" }} />
        </div>
        <div className="skeleton" style={{ width: "60px", height: "22px", borderRadius: "6px" }} />
      </div>
      <div className="skeleton" style={{ width: "80%", height: "18px" }} />
      <div className="skeleton" style={{ width: "60%", height: "18px" }} />
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: "6px" }}>
        <div className="skeleton" style={{ width: "50px", height: "20px", borderRadius: "100px" }} />
        <div className="skeleton" style={{ width: "60px", height: "20px", borderRadius: "100px" }} />
        <div className="skeleton" style={{ width: "45px", height: "20px", borderRadius: "100px" }} />
      </div>
    </div>
  );
}
