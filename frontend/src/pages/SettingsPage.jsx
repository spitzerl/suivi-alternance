import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfileSection from "@/components/settings/ProfileSection";
import PasswordSection from "@/components/settings/PasswordSection";
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";

export default function SettingsPage() {
  const { email, editPassword, deleteAccount, getProfile, updateProfile } =
    useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    email: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwdData, setPwdData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData({
          name: data.name || "",
          lastname: data.lastname || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [getProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      await updateProfile(profileData);
      setProfileSuccess("Profil mis à jour avec succès.");
    } catch (err) {
      setProfileError(
        err.response?.data?.error || "Erreur lors de la mise à jour.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (pwdData.newPassword.length < 8) {
      setPwdError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }
    setPwdLoading(true);
    try {
      await editPassword(pwdData.oldPassword, pwdData.newPassword);
      setPwdSuccess("Mot de passe modifié avec succès.");
      setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwdError(
        err.response?.data?.error || "Erreur lors de la modification.",
      );
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);
      navigate("/login");
    } catch (err) {
      setDeleteError(
        err.response?.data?.error || "Erreur lors de la suppression.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-12 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Connecté en tant que{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <ProfileSection
        profileData={profileData}
        profileError={profileError}
        profileSuccess={profileSuccess}
        profileLoading={profileLoading}
        setProfileData={setProfileData}
        onProfileUpdate={handleProfileUpdate}
      />

      <PasswordSection
        pwdData={pwdData}
        pwdError={pwdError}
        pwdSuccess={pwdSuccess}
        pwdLoading={pwdLoading}
        setPwdData={setPwdData}
        onPasswordChange={handlePasswordChange}
      />

      <DeleteAccountSection
        showDeleteConfirm={showDeleteConfirm}
        deletePassword={deletePassword}
        deleteError={deleteError}
        deleteLoading={deleteLoading}
        setDeletePassword={setDeletePassword}
        setShowDeleteConfirm={setShowDeleteConfirm}
        setDeleteError={setDeleteError}
        onDelete={handleDelete}
      />
    </div>
  );
}
