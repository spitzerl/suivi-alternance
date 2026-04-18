import { ExternalLink, ChevronRight, RotateCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COLUMNS } from "@/constants/applicationConstants";
import {
  formatDate,
  getLatestRelaunchDate,
  timeApplicationToLastRelaunch,
} from "@/utils/applicationUtils";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import HighlightedText from "./HighlightedText";
import SortIcon from "./SortIcon";

export default function ApplicationTable({
  applications,
  sortConfig,
  handleSort,
  searchQuery,
  onEdit,
}) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 space-y-3 border rounded-lg">
        <p className="text-muted-foreground text-sm">
          Aucune candidature correspondant à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className={`text-[12px] font-bold text-foreground uppercase tracking-wider whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-primary transition-colors" : ""} ${col.key === "timeBetween" ? "w-[60px] px-0" : ""} ${col.key === "dateApplication" ? "pr-1" : ""}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span
                  className={`inline-flex items-center gap-0.5 ${col.key === "timeBetween" ? "justify-center w-full" : ""}`}
                >
                  {col.label}
                  {col.sortable && col.label && (
                    <SortIcon column={col.key} sortConfig={sortConfig} />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow
              key={app.id}
              className="group cursor-pointer hover:bg-primary/5 even:bg-muted/20 transition-colors border-b border-muted/50"
              onClick={() => onEdit(app)}
            >
              <TableCell className="font-medium text-[13px] whitespace-nowrap">
                <HighlightedText
                  text={app.companyName}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                <HighlightedText
                  text={app.jobTitle || "~"}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell>
                <StatusBadge status={app.status} highlight={searchQuery} />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                <HighlightedText
                  text={app.location || "~"}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                <HighlightedText
                  text={app.salary || "~"}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                <HighlightedText
                  text={app.source || "~"}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell>
                <PriorityBadge
                  priority={app.priority}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap pr-1">
                <HighlightedText
                  text={formatDate(app.dateApplication)}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap w-[60px] px-0">
                <div className="flex items-center justify-center gap-1.5 opacity-50">
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-[11px] font-medium">
                    {(() => {
                      const days = timeApplicationToLastRelaunch(app);
                      return days !== null ? `${days}j` : "~";
                    })()}
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                <HighlightedText
                  text={formatDate(getLatestRelaunchDate(app))}
                  highlight={searchQuery}
                />
              </TableCell>
              <TableCell>
                {(app.relaunches?.length || 0) > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    <RotateCcw className="h-3 w-3" />
                    <HighlightedText
                      text={app.relaunches.length}
                      highlight={searchQuery}
                    />
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[13px]">
                    <HighlightedText text="~" highlight={searchQuery} />
                  </span>
                )}
              </TableCell>
              <TableCell>
                {app.applicationUrl ? (
                  <a
                    href={app.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  "~"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
