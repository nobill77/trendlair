import SkeletonCard from "@/components/SkeletonCard";

export default function ItemLoading() {
  return (
    <main style={{
      minHeight: "100vh", maxWidth: "1000px", margin: "0 auto",
      padding: "calc(56px + 3rem) 2rem 5rem",
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "2.5rem" }}>
        <div className="skeleton" style={{ width: "70px", height: "12px" }} />
        <span style={{ color: "var(--border)" }}>/</span>
        <div className="skeleton" style={{ width: "160px", height: "12px" }} />
      </div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
          <div className="skeleton" style={{ width: "60px", height: "24px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ width: "120px", height: "24px", borderRadius: "4px" }} />
        </div>
        <div className="skeleton" style={{ width: "70%", height: "52px", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ width: "50%", height: "52px", marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ width: "90%", height: "16px", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ width: "75%", height: "16px", marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ width: "60%", height: "16px", marginBottom: "2rem" }} />
        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
          {[60, 70, 55, 80].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}px`, height: "22px", borderRadius: "4px" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div className="skeleton" style={{ width: "180px", height: "44px", borderRadius: "8px" }} />
          <div className="skeleton" style={{ width: "100px", height: "44px", borderRadius: "8px" }} />
        </div>
      </div>

      {/* Meta grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1px", background: "var(--border)", border: "1px solid var(--border)",
        borderRadius: "12px", overflow: "hidden", marginBottom: "4rem",
      }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ padding: "1.5rem", background: "var(--surface)" }}>
            <div className="skeleton" style={{ width: "50px", height: "10px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ width: "80px", height: "24px" }} />
          </div>
        ))}
      </div>

      {/* Related items */}
      <div>
        <div className="skeleton" style={{ width: "140px", height: "20px", marginBottom: "1.5rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </main>
  );
}
