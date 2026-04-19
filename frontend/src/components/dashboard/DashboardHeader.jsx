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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-center sm:text-left">
          Candidatures
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 text-center sm:text-left">
          {applicationCount} candidature{applicationCount !== 1 ? "s" : ""}
          {searchQuery && ` (sur ${totalCount} au total)`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 sm:h-9 text-[13px] w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1.5 sm:border-l sm:pl-3 sm:ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 sm:h-9 gap-2 flex-1 justify-center"
                >
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden xs:inline">Données</span>
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

          <Button
            size="sm"
            className="h-10 sm:h-9 text-[13px] gap-1.5 flex-1"
            onClick={onAddNew}
          >
            <Plus className="h-4 w-4" /> <span className="inline">Ajouter</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
