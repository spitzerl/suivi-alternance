import { RotateCcw, ChevronUp, ChevronDown, Plus, ChevronRight, Trash2 } from "lucide-react";
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
import { METHOD_OPTIONS } from "@/constants/applicationConstants";
import { formatDate } from "@/utils/applicationUtils";

function ResponseBadge({ response }) {
  if (response === true)
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Oui
      </span>
    );
  if (response === false)
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Non
      </span>
    );
  return <span className="text-muted-foreground text-[11px]">~</span>;
}

export default function RelaunchSection({ 
    relaunches, 
    relaunchForm, 
    showRelaunchForm, 
    editingRelaunchId, 
    savingRelaunch, 
    relaunchesExpanded, 
    setRelaunchesExpanded,
    onRelaunchChange,
    onOpenNewRelaunch,
    onToggleEditRelaunch,
    onCancelRelaunch,
    onRelaunchSubmit,
    onDeleteRelaunch,
    sortedRelaunches
}) {
  return (
    <div className="mt-2 border-t pt-4">
      <button
        type="button"
        className="flex items-center gap-2 w-full text-left group"
        onClick={() => setRelaunchesExpanded((v) => !v)}
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground dark:text-purple-400/70" />
        <span className="text-[14px] font-medium">Relances</span>
        <span className="text-[12px] text-muted-foreground ml-1">
          ({relaunches.length})
        </span>
        {relaunchesExpanded ? (
          <ChevronUp className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        )}
      </button>
      
      {relaunchesExpanded && (
        <div className="mt-3 space-y-3">
          {editingRelaunchId === "new" ? (
            <div className="border rounded-lg p-3 space-y-3 bg-muted/5 border-primary/20 text-[13px]">
              <p className="font-medium">Nouvelle relance</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Date</Label>
                  <Input
                    type="date"
                    value={relaunchForm.date}
                    onChange={(e) => onRelaunchChange("date", e.target.value)}
                    className="h-8 text-[12px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Méthode</Label>
                  <Select
                    value={relaunchForm.method}
                    onValueChange={(v) => onRelaunchChange("method", v)}
                  >
                    <SelectTrigger className="h-8 text-[12px]">
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      {METHOD_OPTIONS.map((m) => (
                        <SelectItem key={m} value={m} className="text-[12px]">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Réponse</Label>
                  <Select
                    value={relaunchForm.response}
                    onValueChange={(v) => onRelaunchChange("response", v)}
                  >
                    <SelectTrigger className="h-8 text-[12px]">
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true" className="text-[12px]">Oui</SelectItem>
                      <SelectItem value="false" className="text-[12px]">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">Notes</Label>
                <Textarea
                  rows={2}
                  value={relaunchForm.notes}
                  onChange={(e) => onRelaunchChange("notes", e.target.value)}
                  className="text-[12px]"
                  placeholder="Détails..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[12px] h-7"
                  onClick={onCancelRelaunch}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="text-[12px] h-7"
                  onClick={onRelaunchSubmit}
                  disabled={savingRelaunch}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[12px] gap-1.5 w-full border-dashed"
              onClick={onOpenNewRelaunch}
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une relance
            </Button>
          )}

          {relaunches.length > 0 ? (
            <div className="space-y-2">
              {sortedRelaunches.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border bg-muted/20 overflow-hidden text-[13px]"
                >
                  <div
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors group"
                    onClick={() => onToggleEditRelaunch(r)}
                  >
                    {editingRelaunchId === r.id ? (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{formatDate(r.date)}</span>
                      {r.method && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {r.method}
                        </span>
                      )}
                      <ResponseBadge response={r.response} />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRelaunch(r.id);
                      }}
                      className="p-1 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                  {editingRelaunchId === r.id && (
                    <div className="p-3 border-t bg-background space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5 text-[12px]">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={relaunchForm.date}
                            onChange={(e) => onRelaunchChange("date", e.target.value)}
                            className="h-8 text-[12px]"
                          />
                        </div>
                        <div className="space-y-1.5 text-[12px]">
                          <Label>Méthode</Label>
                          <Select
                            value={relaunchForm.method}
                            onValueChange={(v) => onRelaunchChange("method", v)}
                          >
                            <SelectTrigger className="h-8 text-[12px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {METHOD_OPTIONS.map((m) => (
                                <SelectItem key={m} value={m} className="text-[12px]">
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 text-[12px]">
                          <Label>Réponse</Label>
                          <Select
                            value={relaunchForm.response}
                            onValueChange={(v) => onRelaunchChange("response", v)}
                          >
                            <SelectTrigger className="h-8 text-[12px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true" className="text-[12px]">Oui</SelectItem>
                              <SelectItem value="false" className="text-[12px]">Non</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[12px]">
                        <Label>Notes</Label>
                        <Textarea
                          rows={2}
                          value={relaunchForm.notes}
                          onChange={(e) => onRelaunchChange("notes", e.target.value)}
                          className="text-[12px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-[12px]"
                          onClick={onCancelRelaunch}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-[12px]"
                          onClick={onRelaunchSubmit}
                          disabled={savingRelaunch}
                        >
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            editingRelaunchId !== "new" && (
              <p className="text-[12px] text-muted-foreground text-center py-2">
                Aucune relance.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
