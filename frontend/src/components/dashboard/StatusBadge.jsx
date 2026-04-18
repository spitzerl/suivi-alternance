import { STATUS_OPTIONS } from "@/constants/applicationConstants";
import HighlightedText from "./HighlightedText";

export default function StatusBadge({ status, highlight }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${opt?.color || "bg-gray-100 text-gray-700"}`}
    >
      {highlight ? (
        <HighlightedText text={status} highlight={highlight} />
      ) : (
        status
      )}
    </span>
  );
}
