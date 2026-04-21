import HighlightedText from "./HighlightedText";

export default function PriorityBadge({ priority, highlight }) {
  if (priority == null) return <span className="text-muted-foreground">~</span>;

  const colors = {
    1: "bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
    2: "bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800",
    3: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700",
    4: "bg-rose-50 text-rose-500 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-800",
    5: "bg-rose-600 text-white dark:bg-rose-600 dark:text-rose-50 border border-rose-700 dark:border-rose-500 shadow-sm shadow-rose-500/20",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[11px] font-semibold ${colors[priority] || "bg-gray-100 text-gray-600"}`}
    >
      <HighlightedText text={priority} highlight={highlight} />
    </span>
  );
}
