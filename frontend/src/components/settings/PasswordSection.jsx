import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordSection({
  pwdData,
  pwdError,
  pwdSuccess,
  pwdLoading,
  setPwdData,
  onPasswordChange,
}) {
  return (
    <section className="space-y-4 border rounded-lg p-5">
      <div>
        <h2 className="text-[15px] font-medium">Changer le mot de passe</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Le nouveau mot de passe doit contenir au moins 8 caractères.
        </p>
      </div>

      {pwdError && (
        <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {pwdError}
        </div>
      )}
      {pwdSuccess && (
        <div className="text-[13px] text-green-700 bg-green-50 rounded-md px-3 py-2">
          {pwdSuccess}
        </div>
      )}

      <form onSubmit={onPasswordChange} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="oldPassword" className="text-[13px]">
            Mot de passe actuel
          </Label>
          <Input
            id="oldPassword"
            type="password"
            required
            value={pwdData.oldPassword}
            onChange={(e) =>
              setPwdData({ ...pwdData, oldPassword: e.target.value })
            }
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-[13px]">
            Nouveau mot de passe
          </Label>
          <Input
            id="newPassword"
            type="password"
            required
            value={pwdData.newPassword}
            onChange={(e) =>
              setPwdData({ ...pwdData, newPassword: e.target.value })
            }
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[13px]">
            Confirmer le nouveau mot de passe
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={pwdData.confirmPassword}
            onChange={(e) =>
              setPwdData({ ...pwdData, confirmPassword: e.target.value })
            }
            className="h-10"
          />
        </div>
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            className="text-[13px]"
            disabled={pwdLoading}
          >
            {pwdLoading ? "Modification…" : "Modifier le mot de passe"}
          </Button>
        </div>
      </form>
    </section>
  );
}
