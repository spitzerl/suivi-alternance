import { useState, useEffect, useMemo } from 'react';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ExternalLink, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Entretien', color: 'bg-blue-100 text-blue-800' },
  { value: 'Acceptée', color: 'bg-green-100 text-green-800' },
  { value: 'Refusée', color: 'bg-red-100 text-red-800' },
  { value: 'Relancée', color: 'bg-purple-100 text-purple-800' },
];

const STATUS_ORDER = { 'Acceptée': 0, 'Entretien': 1, 'Relancée': 2, 'En attente': 3, 'Refusée': 4 };

const emptyForm = {
  companyName: '',
  jobTitle: '',
  status: 'En attente',
  location: '',
  salary: '',
  source: '',
  applicationUrl: '',
  notes: '',
  dateApplication: new Date().toISOString().split('T')[0],
  priority: '',
};

const COLUMNS = [
  { key: 'companyName', label: 'Entreprise', sortable: true },
  { key: 'jobTitle', label: 'Poste', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
  { key: 'dateApplication', label: 'Date', sortable: true },
  { key: 'location', label: 'Lieu', sortable: true },
  { key: 'salary', label: 'Salaire', sortable: true },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'priority', label: 'Priorité', sortable: true },
  { key: 'applicationUrl', label: 'Lien', sortable: false },
];

function statusBadge(status) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${opt?.color || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function priorityBadge(priority) {
  if (priority == null) return <span className="text-muted-foreground">—</span>;
  const colors = {
    1: 'bg-gray-100 text-gray-600',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-orange-100 text-orange-700',
    5: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[11px] font-semibold ${colors[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
  }
  return sortConfig.direction === 'asc'
    ? <ArrowUp className="h-3 w-3 ml-1 text-primary" />
    : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'dateApplication', direction: 'desc' });

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch {
      setError('Impossible de charger les candidatures.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedApplications = useMemo(() => {
    if (!sortConfig.key) return applications;
    const sorted = [...applications].sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key];
      let valB = b[key];

      // Special sorting for status
      if (key === 'status') {
        valA = STATUS_ORDER[valA] ?? 99;
        valB = STATUS_ORDER[valB] ?? 99;
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      // Null handling: nulls always at end
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Numeric fields
      if (key === 'priority') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      // Date fields
      if (key === 'dateApplication') {
        const dA = new Date(valA).getTime();
        const dB = new Date(valB).getTime();
        return direction === 'asc' ? dA - dB : dB - dA;
      }

      // String fields
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      const cmp = strA.localeCompare(strB, 'fr');
      return direction === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [applications, sortConfig]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (app) => {
    setForm({
      companyName: app.companyName || '',
      jobTitle: app.jobTitle || '',
      status: app.status || 'En attente',
      location: app.location || '',
      salary: app.salary || '',
      source: app.source || '',
      applicationUrl: app.applicationUrl || '',
      notes: app.notes || '',
      dateApplication: app.dateApplication ? app.dateApplication.split('T')[0] : '',
      priority: app.priority != null ? String(app.priority) : '',
    });
    setEditingId(app.id);
    setError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      priority: form.priority ? parseInt(form.priority) : null,
      dateApplication: form.dateApplication ? new Date(form.dateApplication).toISOString() : null,
    };
    try {
      if (editingId) {
        await api.patch(`/applications/${editingId}`, payload);
      } else {
        await api.post('/applications', payload);
      }
      setDialogOpen(false);
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Candidatures</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {applications.length} candidature{applications.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-[13px] gap-1.5" onClick={openNew}>
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Modifier la candidature' : 'Nouvelle candidature'}</DialogTitle>
            </DialogHeader>

            {error && (
              <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Entreprise *</Label>
                  <Input required value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Poste</Label>
                  <Input value={form.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Statut *</Label>
                  <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                    <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value} className="text-[13px]">{s.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Date de candidature</Label>
                  <Input type="date" value={form.dateApplication} onChange={(e) => handleChange('dateApplication', e.target.value)} className="h-9 text-[13px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Localisation</Label>
                  <Input value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Salaire</Label>
                  <Input value={form.salary} onChange={(e) => handleChange('salary', e.target.value)} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Source</Label>
                  <Input placeholder="LinkedIn, Indeed…" value={form.source} onChange={(e) => handleChange('source', e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Priorité (1-5)</Label>
                  <Input type="number" min="1" max="5" value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} className="h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Lien de l'offre</Label>
                <Input type="url" placeholder="https://…" value={form.applicationUrl} onChange={(e) => handleChange('applicationUrl', e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">Notes</Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="text-[13px]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="text-[13px]" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button type="submit" size="sm" className="text-[13px]" disabled={saving}>
                  {saving ? 'Enregistrement…' : editingId ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Chargement…</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground text-sm">Aucune candidature pour le moment.</p>
          <Button size="sm" variant="outline" className="text-[13px] gap-1.5" onClick={openNew}>
            <Plus className="h-4 w-4" /> Ajouter votre première candidature
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-[12px] font-medium whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {col.label}
                      {col.sortable && <SortIcon column={col.key} sortConfig={sortConfig} />}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedApplications.map((app) => (
                <TableRow key={app.id} className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => openEdit(app)}>
                  <TableCell className="font-medium text-[13px] whitespace-nowrap">{app.companyName}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">{app.jobTitle || '—'}</TableCell>
                  <TableCell>{statusBadge(app.status)}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">{formatDate(app.dateApplication)}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">{app.location || '—'}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">{app.salary || '—'}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">{app.source || '—'}</TableCell>
                  <TableCell>{priorityBadge(app.priority)}</TableCell>
                  <TableCell>
                    {app.applicationUrl ? (
                      <a href={app.applicationUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-primary hover:text-primary/80">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
