import {
  X,
  Check,
  Bell,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/constants/applicationConstants";

export default function FilterBar({
  filters,
  toggleFilter,
  onFilterChange,
  onReset,
  relaunchThreshold,
  setRelaunchThreshold,
}) {
  const isFiltered =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.needsRelaunch ||
    !filters.hideInactive;

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        <Button
          variant={filters.hideInactive ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 text-[12px] gap-1.5 rounded-full transition-all whitespace-nowrap px-4",
            filters.hideInactive
              ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-muted-foreground border-muted-foreground/20",
          )}
          onClick={() => toggleFilter("hideInactive")}
        >
          {filters.hideInactive ? "Refusés masqués" : "Tout afficher"}
        </Button>

        <div className="flex items-center shrink-0">
          <Button
            variant={filters.needsRelaunch ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 text-[12px] gap-1.5 rounded-l-full border-r-0 transition-all whitespace-nowrap px-4",
              filters.needsRelaunch
                ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700"
                : "text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900/50",
            )}
            onClick={() => toggleFilter("needsRelaunch")}
          >
            <Bell
              className={cn(
                "h-3.5 w-3.5",
                filters.needsRelaunch && "fill-current",
              )}
            />
            À relancer
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.needsRelaunch ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-r-full transition-all border-l-white/20",
                  filters.needsRelaunch
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700"
                    : "text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900/50",
                )}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[220px] p-4 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Seuil de relance
                  </span>
                  <span className="text-sm font-black text-indigo-600">
                    {relaunchThreshold}j
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={relaunchThreshold}
                  onChange={(e) =>
                    setRelaunchThreshold(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase">
                  <span>2j</span>
                  <span>15j</span>
                  <span>30j</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground shrink-0"
            onClick={onReset}
          >
            Effacer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:flex md:items-center gap-2">
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
          <SlidersHorizontal className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0 text-[12px] font-medium w-full md:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tous les statuts</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
          <SlidersHorizontal className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
          <Select
            value={filters.priority}
            onValueChange={(v) => onFilterChange("priority", v)}
          >
            <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0 text-[12px] font-medium w-full md:w-32">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Toutes priorités</SelectItem>
              {[1, 2, 3, 4, 5].map((p) => (
                <SelectItem key={p} value={String(p)}>
                  Priorité {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
