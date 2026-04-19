import {
  X,
  Check,
  Bell,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  Clock,
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-3 sm:py-2 border-y bg-muted/5 px-2">
      <div className="flex items-center gap-2 sm:pr-4 sm:border-r overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        <Button
          variant={filters.hideInactive ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-9 sm:h-8 text-[12px] gap-1.5 transition-all whitespace-nowrap",
            filters.hideInactive
              ? "bg-slate-700 hover:bg-slate-800 text-white dark:bg-slate-600 dark:hover:bg-slate-500"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => toggleFilter("hideInactive")}
        >
          {filters.hideInactive ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {filters.hideInactive ? "Refusés masqués" : "Tout afficher"}
        </Button>

        <div className="flex items-center">
          <Button
            variant={filters.needsRelaunch ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 sm:h-8 text-[12px] gap-1.5 transition-all rounded-r-none border-r-0 whitespace-nowrap",
              filters.needsRelaunch
                ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
                : "text-orange-600 border-orange-200 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20",
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
                  "h-9 sm:h-8 px-1.5 transition-all rounded-l-none border-l-[1px] border-l-white/20",
                  filters.needsRelaunch
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
                    : "text-orange-600 border-orange-200 bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20",
                )}
              >
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[200px] p-4 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Seuil de relance
                  </span>
                  <span className="text-[12px] font-bold text-orange-600 dark:text-orange-400">
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
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-medium px-0.5">
                  <span>2j</span>
                  <span>15j</span>
                  <span>30j</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-muted-foreground hidden xs:inline">
            Statut:
          </span>
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger className="h-9 sm:h-8 w-full sm:w-32 text-[12px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-[12px]">
                Tous les statuts
              </SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="text-[12px]"
                >
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-muted-foreground hidden xs:inline">
            Priorité:
          </span>
          <Select
            value={filters.priority}
            onValueChange={(v) => onFilterChange("priority", v)}
          >
            <SelectTrigger className="h-9 sm:h-8 w-full sm:w-24 text-[12px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-[12px]">
                Toutes
              </SelectItem>
              {[1, 2, 3, 4, 5].map((p) => (
                <SelectItem key={p} value={String(p)} className="text-[12px]">
                  P{p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-[12px] text-muted-foreground hover:text-foreground sm:ml-auto w-full sm:w-auto"
          onClick={onReset}
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
