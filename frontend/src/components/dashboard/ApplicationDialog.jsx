import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/constants/applicationConstants";
import RelaunchSection from "./RelaunchSection";

export default function ApplicationDialog({
  isOpen,
  onOpenChange,
  editingId,
  form,
  error,
  saving,
  onChange,
  onSubmit,
  relaunchProps
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Modifier la candidature" : "Nouvelle candidature"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Entreprise *</Label>
              <Input
                required
                value={form.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Poste</Label>
              <Input
                value={form.jobTitle}
                onChange={(e) => onChange("jobTitle", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Statut *</Label>
              <Select
                value={form.status}
                onValueChange={(v) => onChange("status", v)}
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="text-[13px]">
                      {s.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Date de candidature</Label>
              <Input
                type="date"
                value={form.dateApplication}
                onChange={(e) => onChange("dateApplication", e.target.value)}
                className="h-9 text-[13px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Localisation</Label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Salaire</Label>
              <Input
                value={form.salary}
                onChange={(e) => onChange("salary", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Source</Label>
              <Input
                placeholder="LinkedIn, Indeed…"
                value={form.source}
                onChange={(e) => onChange("source", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Priorité (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={form.priority}
                onChange={(e) => onChange("priority", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]">Lien de l'offre</Label>
            <Input
              type="url"
              placeholder="https://…"
              value={form.applicationUrl}
              onChange={(e) => onChange("applicationUrl", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]">Notes</Label>
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              className="text-[13px]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[13px]"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-[13px]"
              disabled={saving}
            >
              {saving ? "Enregistrement…" : editingId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>

        {editingId && <RelaunchSection {...relaunchProps} />}
      </DialogContent>
    </Dialog>
  );
}
