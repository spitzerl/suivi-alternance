import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSection({
  profileData,
  profileError,
  profileSuccess,
  profileLoading,
  setProfileData,
  onProfileUpdate,
}) {
  return (
    <section className="space-y-4 border rounded-lg p-5">
      <div>
        <h2 className="text-[15px] font-medium">Informations personnelles</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Mettez à jour vos informations de compte.
        </p>
      </div>

      {profileError && (
        <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {profileError}
        </div>
      )}
      {profileSuccess && (
        <div className="text-[13px] text-green-700 bg-green-50 rounded-md px-3 py-2">
          {profileSuccess}
        </div>
      )}

      <form onSubmit={onProfileUpdate} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px]">
              Prénom
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastname" className="text-[13px]">
              Nom
            </Label>
            <Input
              id="lastname"
              value={profileData.lastname}
              onChange={(e) =>
                setProfileData({ ...profileData, lastname: e.target.value })
              }
              className="h-10"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="h-10"
          />
        </div>
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            className="text-[13px]"
            disabled={profileLoading}
          >
            {profileLoading
              ? "Enregistrement…"
              : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </section>
  );
}
