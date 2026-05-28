import SkeletonCard from "@/components/SkeletonCard";

function SkeletonScrollRow() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div className="skeleton" style={{ width: "180px", height: "20px" }} />
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="skeleton" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
          <div className="skeleton" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", overflow: "hidden" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ minWidth: "285px", maxWidth: "285px", flexShrink: 0 }}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <main style={{ minHeight: "100vh", padding: "calc(56px + 3rem) 2rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Header skeleton */}
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        <div className="skeleton" style={{ width: "80px", height: "12px", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ width: "280px", height: "48px", marginBottom: "1.5rem" }} />

        {/* Search bar skeleton */}
        <div className="skeleton" style={{ width: "500px", maxWidth: "100%", height: "40px", borderRadius: "8px", marginBottom: "1.5rem" }} />

        {/* Filter pills skeleton */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {[90, 70, 55, 75, 110, 85, 70].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}px`, height: "30px", borderRadius: "100px" }} />
          ))}
        </div>

        <div className="skeleton" style={{ width: "140px", height: "13px" }} />
      </div>

      {/* Scroll sections skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginBottom: "3rem" }}>
        <SkeletonScrollRow />
        <SkeletonScrollRow />
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      {/* Grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}
