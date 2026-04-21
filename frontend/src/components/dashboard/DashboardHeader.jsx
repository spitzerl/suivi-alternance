import { useRef } from "react";
import {
  Search,
  Settings2,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Download,
  Upload,
  Plus,
} from "lucide-react";
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
  handleExportJSON,
  handleExportCSV,
  handleExportXLS,
} from "@/utils/exportUtils";

export default function DashboardHeader({
  applicationCount,
  totalCount,
  searchQuery,
  setSearchQuery,
  onImportJSON,
  onAddNew,
  filteredApplications,
}) {
  const fileInputRef = useRef(null);

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between px-1">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Candidatures</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {applicationCount} {applicationCount === 1 ? "poste" : "postes"}
            {searchQuery && <span className="lowercase"> (filtrés)</span>}
          </p>
        </div>

        <Button
          size="sm"
          className="h-10 px-4 rounded-full shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
          onClick={onAddNew}
        >
          <Plus className="h-5 w-5" />
          <span className="hidden xs:inline">Ajouter</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Entreprise, poste, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/50 text-base"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-md border-muted-foreground/20"
            >
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-widest">
              Exporter
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleExportXLS(filteredApplications)}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span>Excel (.xlsx)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportCSV(filteredApplications)}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>CSV (.csv)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportJSON(filteredApplications)}
            >
              <Download className="h-4 w-4 mr-2" />
              <span>JSON (.json)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-widest">
              Importer
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={triggerImport}>
              <Upload className="h-4 w-4 mr-2" />
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
          id="json-import"
        />
      </div>
    </div>
  );
}
