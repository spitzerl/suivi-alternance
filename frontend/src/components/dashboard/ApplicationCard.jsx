import {
  ExternalLink,
  RotateCcw,
  Bell,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDate,
  getLatestRelaunchDate,
  timeApplicationToLastRelaunch,
  checkNeedsRelaunch,
} from "@/utils/applicationUtils";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import HighlightedText from "./HighlightedText";

export default function ApplicationCard({
  app,
  searchQuery,
  onEdit,
  relaunchThreshold,
}) {
  const needsRelaunch = checkNeedsRelaunch(app, relaunchThreshold);
  const daysSinceLast = timeApplicationToLastRelaunch(app);

  return (
    <div
      onClick={() => onEdit(app)}
      className={cn(
        "relative flex flex-col gap-3 p-4 rounded-xl border bg-card hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer active:scale-[0.98]",
        needsRelaunch &&
          "border-indigo-500/50 shadow-sm shadow-indigo-500/10 bg-indigo-50/30 dark:bg-indigo-950/10",
      )}
    >
      {needsRelaunch && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg shadow-indigo-500/30 animate-pulse border-2 border-background">
          <Bell className="h-3.5 w-3.5 fill-current" />
        </div>
      )}

      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="font-bold text-base leading-none">
              <HighlightedText text={app.companyName} highlight={searchQuery} />
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">
              <HighlightedText
                text={app.jobTitle || "Poste non spécifié"}
                highlight={searchQuery}
              />
            </p>
          </div>
        </div>
        <PriorityBadge priority={app.priority} highlight={searchQuery} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <StatusBadge status={app.status} highlight={searchQuery} />
        {app.location && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-[11px] font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <HighlightedText text={app.location} highlight={searchQuery} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 mt-auto border-t border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            Candidature
          </p>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-[12px] font-medium">
              {formatDate(app.dateApplication)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
            Dernière relance
          </p>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-3 w-3 text-muted-foreground" />
            <span
              className={cn(
                "text-[12px] font-medium",
                app.relaunches?.length > 0
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-muted-foreground",
              )}
            >
              {app.relaunches?.length > 0 ? (
                <>
                  {formatDate(getLatestRelaunchDate(app))}
                  <span className="ml-1 text-[10px] opacity-70">
                    ({app.relaunches.length})
                  </span>
                </>
              ) : (
                "~"
              )}
            </span>
          </div>
        </div>
      </div>

      {app.applicationUrl && (
        <a
          href={app.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
