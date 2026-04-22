import { useRef } from "react";
import {
  X,
  Search,
  Settings2,
  FileSpreadsheet,
  FileText,
  Download,
  Upload,
  Bell,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  handleExportJSON,
  handleExportCSV,
  handleExportXLS,
} from "@/utils/exportUtils";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  filters,
  toggleFilter,
  onFilterChange,
  onReset,
  relaunchThreshold,
  setRelaunchThreshold,
  onImportJSON,
  filteredApplications,
}) {
  const fileInputRef = useRef(null);

  const isFiltered =
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.needsRelaunch ||
    !filters.hideInactive ||
    searchQuery !== "";

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const activeClass =
    "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm";
  const inactiveClass =
    "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted/80";

  return (
    <div className="flex flex-col gap-3">
      {/* Search and Main Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 text-sm rounded-full transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[180px] rounded-2xl shadow-xl border-muted-foreground/10 p-1.5"
          >
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 py-2">
              Exporter
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleExportXLS(filteredApplications)}
              className="text-xs rounded-xl cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
              <span>Excel (.xlsx)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportCSV(filteredApplications)}
              className="text-xs rounded-xl cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 mr-2" />
              <span>CSV (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportJSON(filteredApplications)}
              className="text-xs rounded-xl cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              <span>JSON (.json)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5 opacity-50" />
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 py-2">
              Importer
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={triggerImport}
              className="text-xs rounded-xl cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 mr-2" />
              <span>JSON (.json)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={onImportJSON}
          className="hidden"
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 text-[11px] font-bold rounded-full transition-all px-4 border shadow-none",
            filters.hideInactive ? activeClass : inactiveClass,
          )}
          onClick={() => toggleFilter("hideInactive")}
        >
          {filters.hideInactive ? "Refusés masqués" : "Tout afficher"}
        </Button>

        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-[11px] font-bold rounded-l-full border-r-0 transition-all px-4 shadow-none",
              filters.needsRelaunch ? activeClass : inactiveClass,
            )}
            onClick={() => toggleFilter("needsRelaunch")}
          >
            <Bell
              className={cn(
                "h-3 w-3 mr-1.5",
                filters.needsRelaunch && "fill-current",
              )}
            />
            À relancer
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-r-full transition-all border-l-primary/20 shadow-none",
                  filters.needsRelaunch ? activeClass : inactiveClass,
                )}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[200px] p-5 rounded-2xl shadow-xl border-muted-foreground/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Seuil de relance
                  </span>
                  <span className="text-sm font-black text-primary">
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
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange("status", v)}
          >
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-[11px] font-bold bg-muted/50 border-transparent rounded-full focus:ring-0 px-4 hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-muted-foreground/10 p-1">
              <SelectItem value="All" className="text-xs rounded-xl">
                Tous les statuts
              </SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="text-xs rounded-xl"
                >
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(v) => onFilterChange("priority", v)}
          >
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-[11px] font-bold bg-muted/50 border-transparent rounded-full focus:ring-0 px-4 hover:bg-muted/80 transition-colors">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="Priorité" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-muted-foreground/10 p-1">
              <SelectItem value="All" className="text-xs rounded-xl">
                Toutes priorités
              </SelectItem>
              {[1, 2, 3, 4, 5].map((p) => (
                <SelectItem
                  key={p}
                  value={String(p)}
                  className="text-xs rounded-xl"
                >
                  Priorité {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors ml-auto"
            onClick={onReset}
          >
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
