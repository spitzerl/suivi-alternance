import { X, Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/constants/applicationConstants";

export default function FilterBar({ filters, toggleFilter, onFilterChange, onReset }) {
  const isFiltered = (filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.needsRelaunch ||
    !filters.hideInactive);

  return (
    <div className="flex items-center flex-wrap gap-4 py-2 border-y bg-muted/5 px-1">
      <div className="flex items-center gap-2 pr-4 border-r">
        <Button
          variant={filters.hideInactive ? "secondary" : "outline"}
          size="sm"
          className="h-8 text-[12px] gap-1.5"
          onClick={() => toggleFilter("hideInactive")}
        >
          {filters.hideInactive ? (
            <X className="h-3 w-3" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          Masquer refusés/abandonnés
        </Button>

        <Button
          variant={filters.needsRelaunch ? "secondary" : "outline"}
          size="sm"
          className="h-8 text-[12px] gap-1.5 text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
          onClick={() => toggleFilter("needsRelaunch")}
        >
          <Bell className="h-3 w-3" />À relancer
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-muted-foreground">Statut:</span>
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger className="h-8 w-32 text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-[12px]">
                Tous
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
          <span className="text-[12px] text-muted-foreground">Priorité:</span>
          <Select
            value={filters.priority}
            onValueChange={(v) => onFilterChange("priority", v)}
          >
            <SelectTrigger className="h-8 w-24 text-[12px]">
              <SelectValue />
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
          className="h-8 text-[12px] text-muted-foreground hover:text-foreground ml-auto"
          onClick={onReset}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
