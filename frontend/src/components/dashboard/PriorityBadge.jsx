import HighlightedText from "./HighlightedText";

export default function PriorityBadge({ priority, highlight }) {
  if (priority == null) return <span className="text-muted-foreground">~</span>;
  
  const colors = {
    1: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    2: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    4: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    5: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[11px] font-semibold ${colors[priority] || "bg-gray-100 text-gray-600"}`}
    >
      <HighlightedText text={priority} highlight={highlight} />
    </span>
  );
}
