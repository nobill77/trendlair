import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

export default function TagBadge({ tag, clickable = true }: TagBadgeProps) {
  const style = {
    display: "inline-block",
    padding: "2px 10px",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    border: "1px solid var(--border)",
    borderRadius: "4px",
    color: "var(--muted)",
    background: "transparent",
    textDecoration: "none",
    transition: "border-color 0.2s, color 0.2s",
    cursor: clickable ? "pointer" : "default",
  };

  if (!clickable) return <span style={style}>{tag}</span>;

  return (
    <Link href={`/discover?tag=${tag}`} style={style}>
      {tag}
    </Link>
  );
}
