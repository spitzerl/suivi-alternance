export default function HighlightedText({ text, highlight }) {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const parts = String(text).split(
    new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
  );
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit p-0 rounded-sm"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}
