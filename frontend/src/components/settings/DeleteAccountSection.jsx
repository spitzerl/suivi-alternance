import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeleteAccountSection({
  showDeleteConfirm,
  deletePassword,
  deleteError,
  deleteLoading,
  setDeletePassword,
  setShowDeleteConfirm,
  setDeleteError,
  onDelete,
}) {
  return (
    <section className="space-y-4 border border-destructive/20 rounded-lg p-5">
      <div>
        <h2 className="text-[15px] font-medium text-destructive">
          Supprimer le compte
        </h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Cette action est irréversible. Toutes vos données seront supprimées.
        </p>
      </div>

      {!showDeleteConfirm ? (
        <Button
          variant="destructive"
          size="sm"
          className="text-[13px]"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Supprimer mon compte
        </Button>
      ) : (
        <>
          {deleteError && (
            <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {deleteError}
            </div>
          )}
          <form onSubmit={onDelete} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="deletePassword" className="text-[13px]">
                Confirmez avec votre mot de passe
              </Label>
              <Input
                id="deletePassword"
                type="password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[13px]"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="text-[13px]"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Suppression…" : "Confirmer la suppression"}
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
