import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({
  applicationCount,
  onAddNew,
  searchQuery,
}) {
  return (
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
        className="h-10 px-6 rounded-full shadow-lg shadow-primary/20 gap-2 transition-all active:scale-95 font-bold text-xs uppercase tracking-wider"
        onClick={onAddNew}
      >
        <Plus className="h-4 w-4" />
        <span>Ajouter</span>
      </Button>
    </div>
  );
}
