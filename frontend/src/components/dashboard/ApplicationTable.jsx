import { ExternalLink, ChevronRight, RotateCcw, Bell } from "lucide-react";
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
  checkNeedsRelaunch,
} from "@/utils/applicationUtils";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import HighlightedText from "./HighlightedText";
import SortIcon from "./SortIcon";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationTable({
  applications,
  sortConfig,
  handleSort,
  searchQuery,
  onEdit,
  relaunchThreshold,
}) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 space-y-4 border-2 border-dashed rounded-2xl bg-muted/20">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <RotateCcw className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground font-medium">
            Aucune candidature trouvée.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Essayez de modifier vos filtres ou lancez une nouvelle recherche.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            searchQuery={searchQuery}
            onEdit={onEdit}
            relaunchThreshold={relaunchThreshold}
          />
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-[11px] font-bold text-muted-foreground uppercase tracking-widest py-4 ${col.sortable ? "cursor-pointer select-none hover:text-primary transition-colors" : ""} ${col.key === "timeBetween" ? "w-[60px] px-0" : ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 ${col.key === "timeBetween" ? "justify-center w-full" : ""}`}
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
                  className="group cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onEdit(app)}
                >
                  <TableCell className="font-semibold text-[13px] py-4">
                    <div className="flex items-center gap-2">
                      <HighlightedText
                        text={app.companyName}
                        highlight={searchQuery}
                      />
                      {checkNeedsRelaunch(app, relaunchThreshold) && (
                        <Bell className="h-3 w-3 text-orange-500 fill-orange-500 animate-pulse" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    <HighlightedText
                      text={app.jobTitle || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} highlight={searchQuery} />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    <HighlightedText
                      text={app.location || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    <HighlightedText
                      text={app.salary || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
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
                  <TableCell className="text-[13px] text-muted-foreground">
                    {formatDate(app.dateApplication)}
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground px-0">
                    <div className="flex items-center justify-center gap-1.5 opacity-50">
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-[11px] font-bold">
                        {(() => {
                          const days = timeApplicationToLastRelaunch(app);
                          return days !== null ? `${days}j` : "~";
                        })()}
                      </span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    {formatDate(getLatestRelaunchDate(app))}
                  </TableCell>
                  <TableCell>
                    {(app.relaunches?.length || 0) > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <RotateCcw className="h-3 w-3" />
                        {app.relaunches.length}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[13px]">
                        ~
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
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
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
      </div>
    </>
  );
}
