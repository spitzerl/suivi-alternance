import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { email, editPassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  // Change password state
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (pwdData.newPassword.length < 8) {
      setPwdError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setPwdLoading(true);
    try {
      await editPassword(pwdData.oldPassword, pwdData.newPassword);
      setPwdSuccess('Mot de passe modifié avec succès.');
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdError(err.response?.data?.error || 'Erreur lors de la modification.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-12 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Connecté en tant que <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Change password */}
      <section className="space-y-4 border rounded-lg p-5">
        <div>
          <h2 className="text-[15px] font-medium">Changer le mot de passe</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Le nouveau mot de passe doit contenir au moins 8 caractères.</p>
        </div>

        {pwdError && (
          <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">{pwdError}</div>
        )}
        {pwdSuccess && (
          <div className="text-[13px] text-green-700 bg-green-50 rounded-md px-3 py-2">{pwdSuccess}</div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword" className="text-[13px]">Mot de passe actuel</Label>
            <Input id="oldPassword" type="password" required value={pwdData.oldPassword} onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-[13px]">Nouveau mot de passe</Label>
            <Input id="newPassword" type="password" required value={pwdData.newPassword} onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-[13px]">Confirmer le nouveau mot de passe</Label>
            <Input id="confirmPassword" type="password" required value={pwdData.confirmPassword} onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })} className="h-10" />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" className="text-[13px]" disabled={pwdLoading}>
              {pwdLoading ? 'Modification…' : 'Modifier le mot de passe'}
            </Button>
          </div>
        </form>
      </section>

      {/* Delete account */}
      <section className="space-y-4 border border-destructive/20 rounded-lg p-5">
        <div>
          <h2 className="text-[15px] font-medium text-destructive">Supprimer le compte</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Cette action est irréversible. Toutes vos données seront supprimées.</p>
        </div>

        {!showDeleteConfirm ? (
          <Button variant="destructive" size="sm" className="text-[13px]" onClick={() => setShowDeleteConfirm(true)}>
            Supprimer mon compte
          </Button>
        ) : (
          <>
            {deleteError && (
              <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">{deleteError}</div>
            )}
            <form onSubmit={handleDelete} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="deletePassword" className="text-[13px]">Confirmez avec votre mot de passe</Label>
                <Input id="deletePassword" type="password" required value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="h-10" />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button type="button" variant="outline" size="sm" className="text-[13px]" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}>
                  Annuler
                </Button>
                <Button type="submit" variant="destructive" size="sm" className="text-[13px]" disabled={deleteLoading}>
                  {deleteLoading ? 'Suppression…' : 'Confirmer la suppression'}
                </Button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
