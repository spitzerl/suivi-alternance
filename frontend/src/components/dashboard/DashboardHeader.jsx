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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Candidatures</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {applicationCount} candidature{applicationCount !== 1 ? "s" : ""}
          {searchQuery && ` (sur ${totalCount} au total)`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-[13px]"
          />
        </div>

        <div className="flex items-center gap-1.5 border-l pl-3 ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Données</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
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
              <DropdownMenuItem asChild>
                <label
                  htmlFor="json-import"
                  className="cursor-pointer flex items-center w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>JSON (.json)</span>
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="file"
            accept=".json"
            onChange={onImportJSON}
            className="hidden"
            id="json-import"
          />
        </div>

        <Button size="sm" className="text-[13px] gap-1.5" onClick={onAddNew}>
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>
    </div>
  );
}
