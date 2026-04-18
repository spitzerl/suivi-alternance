import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
  }
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="h-3 w-3 ml-1 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 ml-1 text-primary" />
  );
}
