import { useState, useEffect, useMemo } from "react";
import ExcelJS from "exceljs";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Bell,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  Settings2,
} from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "En attente",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "Entretien",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "Acceptée",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "Refusée",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    value: "Abandonnée",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
  },
  {
    value: "Relancée",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

const STATUS_ORDER = {
  Acceptée: 0,
  Entretien: 1,
  Relancée: 2,
  "En attente": 3,
  Refusée: 4,
  Abandonnée: 5,
};
const INACTIVE_STATUSES = ["Refusée", "Abandonnée"];

const METHOD_OPTIONS = ["Email", "Téléphone", "LinkedIn", "Courrier", "Autre"];

const emptyForm = {
  companyName: "",
  jobTitle: "",
  status: "En attente",
  location: "",
  salary: "",
  source: "",
  applicationUrl: "",
  notes: "",
  dateApplication: new Date().toISOString().split("T")[0],
  priority: "",
};

const emptyRelaunchForm = {
  date: new Date().toISOString().split("T")[0],
  method: "",
  notes: "",
  response: "",
};

const COLUMNS = [
  { key: "companyName", label: "Entreprise", sortable: true },
  { key: "jobTitle", label: "Poste", sortable: true },
  { key: "status", label: "Statut", sortable: true },
  { key: "location", label: "Lieu", sortable: true },
  { key: "salary", label: "Salaire", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "priority", label: "Priorité", sortable: true },
  { key: "dateApplication", label: "Date candidature", sortable: true },
  { key: "timeBetween", label: "", sortable: true },
  { key: "lastRelaunch", label: "Dernière Relance", sortable: true },
  { key: "relaunches", label: "Relances", sortable: true },
  { key: "applicationUrl", label: "Lien", sortable: false },
];

function statusBadge(status) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${opt?.color || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function priorityBadge(priority, highlight) {
  if (priority == null) return <span className="text-muted-foreground">~</span>;
  const colors = {
    1: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    2: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    4: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    5: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[11px] font-semibold ${colors[priority] || "bg-gray-100 text-gray-600"}`}
    >
      <HighlightedText text={priority} highlight={highlight} />
    </span>
  );
}

function responseBadge(response) {
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

const formatDate = (d) => {
  if (!d) return "~";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLatestRelaunchDate = (app) => {
  if (!app.relaunches || app.relaunches.length === 0) return null;
  const dates = app.relaunches.map((r) => new Date(r.date).getTime());
  return Math.max(...dates);
};

const timeApplicationToLastRelaunch = (app) => {
  if (!app.dateApplication) return null;
  const lastRelaunch = getLatestRelaunchDate(app);
  if (!lastRelaunch) return null;

  const start = new Date(app.dateApplication);
  const end = new Date(lastRelaunch);
  
  // Start and end dates are compared to get the number of days
  const diffTime = Math.abs(end - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

function HighlightedText({ text, highlight }) {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const parts = String(text).split(
    new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
  );
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit p-0 rounded-sm"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
  }
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="h-3 w-3 ml-1 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 ml-1 text-primary" />
  );
}

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "dateApplication",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    hideInactive: true,
    status: "All",
    priority: "All",
    needsRelaunch: false,
  });

  // Relaunch state
  const [relaunches, setRelaunches] = useState([]);
  const [relaunchForm, setRelaunchForm] = useState(emptyRelaunchForm);
  const [showRelaunchForm, setShowRelaunchForm] = useState(false);
  const [editingRelaunchId, setEditingRelaunchId] = useState(null);
  const [savingRelaunch, setSavingRelaunch] = useState(false);
  const [relaunchesExpanded, setRelaunchesExpanded] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch {
      setError("Impossible de charger les candidatures.");
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
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedApplications = useMemo(() => {
    if (!sortConfig.key) return applications;
    const sorted = [...applications].sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key];
      let valB = b[key];

      // Sort by relaunch count
      if (key === "relaunches") {
        valA = a.relaunches?.length || 0;
        valB = b.relaunches?.length || 0;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Sort by last relaunch date
      if (key === "lastRelaunch") {
        valA = getLatestRelaunchDate(a);
        valB = getLatestRelaunchDate(b);
        if (valA === null && valB === null) return 0;
        if (valA === null) return 1;
        if (valB === null) return -1;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Sort by time between
      if (key === "timeBetween") {
        valA = timeApplicationToLastRelaunch(a);
        valB = timeApplicationToLastRelaunch(b);
        if (valA === null && valB === null) return 0;
        if (valA === null) return 1;
        if (valB === null) return -1;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Special sorting for status
      if (key === "status") {
        valA = STATUS_ORDER[valA] ?? 99;
        valB = STATUS_ORDER[valB] ?? 99;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Null handling: nulls always at end
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Numeric fields
      if (key === "priority") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Date fields
      if (key === "dateApplication") {
        const dA = new Date(valA).getTime();
        const dB = new Date(valB).getTime();
        return direction === "asc" ? dA - dB : dB - dA;
      }

      // String fields
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      const cmp = strA.localeCompare(strB, "fr");
      return direction === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [applications, sortConfig]);

  const filteredApplications = useMemo(() => {
    let result = [...sortedApplications];

    // 1. Filter by inactive status
    if (filters.hideInactive) {
      result = result.filter((app) => !INACTIVE_STATUSES.includes(app.status));
    }

    // 2. Filter by specific status
    if (filters.status !== "All") {
      result = result.filter((app) => app.status === filters.status);
    }

    // 3. Filter by priority
    if (filters.priority !== "All") {
      result = result.filter(
        (app) => app.priority === parseInt(filters.priority),
      );
    }

    // 4. Filter by Needs Relaunch
    if (filters.needsRelaunch) {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      result = result.filter((app) => {
        if (app.status !== "En attente" && app.status !== "Relancée")
          return false;
        const lastActivityDate =
          getLatestRelaunchDate(app) || new Date(app.dateApplication).getTime();
        return lastActivityDate < tenDaysAgo.getTime();
      });
    }

    // 5. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((app) => {
        const searchFields = [
          app.companyName,
          app.jobTitle,
          app.status,
          app.location,
          app.salary,
          app.source,
          app.notes,
          app.priority,
          app.relaunches?.length,
          formatDate(app.dateApplication),
          formatDate(getLatestRelaunchDate(app)),
        ];
        return searchFields.some((f) =>
          String(f ?? "")
            .toLowerCase()
            .includes(q),
        );
      });
    }

    return result;
  }, [sortedApplications, searchQuery, filters]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setRelaunches([]);
    setRelaunchesExpanded(false);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (app) => {
    setForm({
      companyName: app.companyName || "",
      jobTitle: app.jobTitle || "",
      status: app.status || "En attente",
      location: app.location || "",
      salary: app.salary || "",
      source: app.source || "",
      applicationUrl: app.applicationUrl || "",
      notes: app.notes || "",
      dateApplication: app.dateApplication
        ? app.dateApplication.split("T")[0]
        : "",
      priority: app.priority != null ? String(app.priority) : "",
    });
    setEditingId(app.id);
    setRelaunches(app.relaunches || []);
    setRelaunchesExpanded((app.relaunches || []).length > 0);
    setError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      priority: form.priority ? parseInt(form.priority) : null,
      dateApplication: form.dateApplication
        ? new Date(form.dateApplication).toISOString()
        : null,
    };
    try {
      if (editingId) {
        await api.patch(`/applications/${editingId}`, payload);
      } else {
        await api.post("/applications", payload);
      }
      setDialogOpen(false);
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // --- Relaunch handlers ---
  const handleRelaunchChange = (field, value) => {
    setRelaunchForm((prev) => ({ ...prev, [field]: value }));
  };

  const openNewRelaunch = () => {
    setRelaunchForm(emptyRelaunchForm);
    setEditingRelaunchId("new");
    setShowRelaunchForm(true);
  };

  const toggleEditRelaunch = (r) => {
    if (editingRelaunchId === r.id) {
      cancelRelaunchForm();
    } else {
      setRelaunchForm({
        date: r.date ? r.date.split("T")[0] : "",
        method: r.method || "",
        notes: r.notes || "",
        response:
          r.response === true ? "true" : r.response === false ? "false" : "",
      });
      setEditingRelaunchId(r.id);
      setShowRelaunchForm(false);
    }
  };

  const cancelRelaunchForm = () => {
    setShowRelaunchForm(false);
    setEditingRelaunchId(null);
    setRelaunchForm(emptyRelaunchForm);
  };

  const handleRelaunchSubmit = async () => {
    if (!editingId) return;
    setSavingRelaunch(true);
    const payload = {
      date: relaunchForm.date || null,
      method: relaunchForm.method || null,
      notes: relaunchForm.notes || null,
      response:
        relaunchForm.response === "true"
          ? true
          : relaunchForm.response === "false"
            ? false
            : null,
    };
    try {
      if (editingRelaunchId && editingRelaunchId !== "new") {
        const res = await api.patch(
          `/applications/${editingId}/relaunches/${editingRelaunchId}`,
          payload,
        );
        setRelaunches((prev) =>
          prev.map((r) => (r.id === editingRelaunchId ? res.data : r)),
        );
      } else {
        const res = await api.post(
          `/applications/${editingId}/relaunches`,
          payload,
        );
        setRelaunches((prev) => [...prev, res.data]);
      }
      cancelRelaunchForm();
      fetchApplications();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Erreur lors de la sauvegarde de la relance.",
      );
    } finally {
      setSavingRelaunch(false);
    }
  };

  const deleteRelaunch = async (relaunchId) => {
    if (!editingId) return;
    try {
      await api.delete(`/applications/${editingId}/relaunches/${relaunchId}`);
      setRelaunches((prev) => prev.filter((r) => r.id !== relaunchId));
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  const sortedRelaunches = useMemo(() => {
    return [...relaunches].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [relaunches]);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `candidatures_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = [
      "Entreprise",
      "Poste",
      "Statut",
      "Lieu",
      "Date Candidature",
      "Nb Relances",
      "Dernière Relance",
      "Notes",
      "Lien Offre",
    ];

    const formatCSVDate = (d) => {
      if (!d) return "";
      return new Date(d).toLocaleDateString("fr-FR");
    };

    const rows = filteredApplications.map((app) => [
      app.companyName,
      app.jobTitle || "",
      app.status,
      app.location || "",
      formatCSVDate(app.dateApplication),
      app.relaunches?.length || 0,
      formatCSVDate(getLatestRelaunchDate(app)),
      (app.notes || "").replace(/\n/g, " "),
      app.applicationUrl || "",
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(";"),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `suivi_candidatures_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLS = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Suivi Candidatures");

    // Configure columns
    worksheet.columns = [
      { header: "Entreprise", key: "companyName", width: 25 },
      { header: "Poste", key: "jobTitle", width: 30 },
      { header: "Statut", key: "status", width: 15 },
      { header: "Lieu", key: "location", width: 20 },
      { header: "Date Candidature", key: "dateApplication", width: 18 },
      { header: "Nb Relances", key: "nbRelaunches", width: 12 },
      { header: "Dernière Relance", key: "lastRelaunch", width: 18 },
      { header: "Notes", key: "notes", width: 40 },
      { header: "Lien Offre", key: "applicationUrl", width: 30 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    // Add data rows
    filteredApplications.forEach((app, i) => {
      const row = worksheet.addRow({
        companyName: app.companyName,
        jobTitle: app.jobTitle || "",
        status: app.status,
        location: app.location || "",
        dateApplication: app.dateApplication
          ? new Date(app.dateApplication).toLocaleDateString("fr-FR")
          : "",
        nbRelaunches: app.relaunches?.length || 0,
        lastRelaunch: getLatestRelaunchDate(app)
          ? new Date(getLatestRelaunchDate(app)).toLocaleDateString("fr-FR")
          : "",
        notes: app.notes || "",
        applicationUrl: app.applicationUrl || "",
      });

      // Zebra striping for even rows
      const fillColor = i % 2 !== 0 ? "FFF9FAFB" : "FFFFFFFF";

      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
      });
    });

    // Generate the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `suivi_candidatures_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setLoading(true);
        await api.post("/applications/bulk", json);
        fetchApplications();
        // Message informatif ou toast ici si possible, sinon le refresh suffit
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Erreur lors de l'importation. Vérifiez le format du fichier.",
        );
        setLoading(false);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Candidatures
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredApplications.length} candidature
            {filteredApplications.length !== 1 ? "s" : ""}
            {searchQuery && ` (sur ${applications.length} au total)`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-[13px]"
            />
          </div>

          <div className="flex items-center gap-1.5 border-l pl-3 ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span>Données</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-widest">
                  Exporter
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExportXLS}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span>Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  <span>CSV (.csv)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  <span>JSON (.json)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-widest">
                  Importer
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <label htmlFor="json-import" className="cursor-pointer flex items-center w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    <span>JSON (.json)</span>
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
              id="json-import"
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="text-[13px] gap-1.5"
                onClick={openNew}
              >
                <Plus className="h-4 w-4" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId
                    ? "Modifier la candidature"
                    : "Nouvelle candidature"}
                </DialogTitle>
              </DialogHeader>

              {error && (
                <div className="text-[13px] text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Entreprise *</Label>
                    <Input
                      required
                      value={form.companyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Poste</Label>
                    <Input
                      value={form.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Statut *</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => handleChange("status", v)}
                    >
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem
                            key={s.value}
                            value={s.value}
                            className="text-[13px]"
                          >
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
                      onChange={(e) =>
                        handleChange("dateApplication", e.target.value)
                      }
                      className="h-9 text-[13px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Localisation</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Salaire</Label>
                    <Input
                      value={form.salary}
                      onChange={(e) => handleChange("salary", e.target.value)}
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
                      onChange={(e) => handleChange("source", e.target.value)}
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
                      onChange={(e) => handleChange("priority", e.target.value)}
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
                    onChange={(e) =>
                      handleChange("applicationUrl", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px]">Notes</Label>
                  <Textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[13px]"
                    onClick={() => setDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-[13px]"
                    disabled={saving}
                  >
                    {saving
                      ? "Enregistrement…"
                      : editingId
                        ? "Modifier"
                        : "Ajouter"}
                  </Button>
                </div>
              </form>

              {editingId && (
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
                                onChange={(e) =>
                                  handleRelaunchChange("date", e.target.value)
                                }
                                className="h-8 text-[12px]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[12px]">Méthode</Label>
                              <Select
                                value={relaunchForm.method}
                                onValueChange={(v) =>
                                  handleRelaunchChange("method", v)
                                }
                              >
                                <SelectTrigger className="h-8 text-[12px]">
                                  <SelectValue placeholder="~" />
                                </SelectTrigger>
                                <SelectContent>
                                  {METHOD_OPTIONS.map((m) => (
                                    <SelectItem
                                      key={m}
                                      value={m}
                                      className="text-[12px]"
                                    >
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
                                onValueChange={(v) =>
                                  handleRelaunchChange("response", v)
                                }
                              >
                                <SelectTrigger className="h-8 text-[12px]">
                                  <SelectValue placeholder="~" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem
                                    value="true"
                                    className="text-[12px]"
                                  >
                                    Oui
                                  </SelectItem>
                                  <SelectItem
                                    value="false"
                                    className="text-[12px]"
                                  >
                                    Non
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[12px]">Notes</Label>
                            <Textarea
                              rows={2}
                              value={relaunchForm.notes}
                              onChange={(e) =>
                                handleRelaunchChange("notes", e.target.value)
                              }
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
                              onClick={cancelRelaunchForm}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="text-[12px] h-7"
                              onClick={handleRelaunchSubmit}
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
                          onClick={openNewRelaunch}
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
                                onClick={() => toggleEditRelaunch(r)}
                              >
                                {editingRelaunchId === r.id ? (
                                  <ChevronDown className="h-4 w-4 text-primary" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">
                                    {formatDate(r.date)}
                                  </span>
                                  {r.method && (
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                      {r.method}
                                    </span>
                                  )}
                                  {responseBadge(r.response)}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRelaunch(r.id);
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
                                        onChange={(e) =>
                                          handleRelaunchChange(
                                            "date",
                                            e.target.value,
                                          )
                                        }
                                        className="h-8 text-[12px]"
                                      />
                                    </div>
                                    <div className="space-y-1.5 text-[12px]">
                                      <Label>Méthode</Label>
                                      <Select
                                        value={relaunchForm.method}
                                        onValueChange={(v) =>
                                          handleRelaunchChange("method", v)
                                        }
                                      >
                                        <SelectTrigger className="h-8 text-[12px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {METHOD_OPTIONS.map((m) => (
                                            <SelectItem
                                              key={m}
                                              value={m}
                                              className="text-[12px]"
                                            >
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
                                        onValueChange={(v) =>
                                          handleRelaunchChange("response", v)
                                        }
                                      >
                                        <SelectTrigger className="h-8 text-[12px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem
                                            value="true"
                                            className="text-[12px]"
                                          >
                                            Oui
                                          </SelectItem>
                                          <SelectItem
                                            value="false"
                                            className="text-[12px]"
                                          >
                                            Non
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5 text-[12px]">
                                    <Label>Notes</Label>
                                    <Textarea
                                      rows={2}
                                      value={relaunchForm.notes}
                                      onChange={(e) =>
                                        handleRelaunchChange(
                                          "notes",
                                          e.target.value,
                                        )
                                      }
                                      className="text-[12px]"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-[12px]"
                                      onClick={cancelRelaunchForm}
                                    >
                                      Annuler
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="h-7 text-[12px]"
                                      onClick={handleRelaunchSubmit}
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
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-4 py-2 border-y bg-muted/5 px-1">
        <div className="flex items-center gap-2 pr-4 border-r">
          <Button
            variant={filters.hideInactive ? "secondary" : "outline"}
            size="sm"
            className="h-8 text-[12px] gap-1.5"
            onClick={() => toggleFilter("hideInactive")}
          >
            {filters.hideInactive ? (
              <X className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Masquer refusés/abandonnés
          </Button>

          <Button
            variant={filters.needsRelaunch ? "secondary" : "outline"}
            size="sm"
            className="h-8 text-[12px] gap-1.5 text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
            onClick={() => toggleFilter("needsRelaunch")}
          >
            <Bell className="h-3 w-3" />À relancer
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-muted-foreground">Statut:</span>
            <Select
              value={filters.status}
              onValueChange={(v) => handleFilterChange("status", v)}
            >
              <SelectTrigger className="h-8 w-32 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-[12px]">
                  Tous
                </SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem
                    key={s.value}
                    value={s.value}
                    className="text-[12px]"
                  >
                    {s.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-muted-foreground">Priorité:</span>
            <Select
              value={filters.priority}
              onValueChange={(v) => handleFilterChange("priority", v)}
            >
              <SelectTrigger className="h-8 w-24 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-[12px]">
                  Toutes
                </SelectItem>
                {[1, 2, 3, 4, 5].map((p) => (
                  <SelectItem key={p} value={String(p)} className="text-[12px]">
                    P{p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filters.status !== "All" ||
          filters.priority !== "All" ||
          filters.needsRelaunch ||
          !filters.hideInactive) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[12px] text-muted-foreground hover:text-foreground ml-auto"
            onClick={() =>
              setFilters({
                hideInactive: true,
                status: "All",
                priority: "All",
                needsRelaunch: false,
              })
            }
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          Chargement…
        </p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground text-sm">
            Aucune candidature pour le moment.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="text-[13px] gap-1.5"
            onClick={openNew}
          >
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
                    className={`text-[12px] font-bold text-foreground uppercase tracking-wider whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-primary transition-colors" : ""} ${col.key === "timeBetween" ? "w-[60px] px-0" : ""} ${col.key === "dateApplication" ? "pr-1" : ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className={`inline-flex items-center gap-0.5 ${col.key === "timeBetween" ? "justify-center w-full" : ""}`}>
                      {col.label}
                      {col.sortable && col.label && (
                        <SortIcon column={col.key} sortConfig={sortConfig} />
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow
                  key={app.id}
                  className="group cursor-pointer hover:bg-primary/5 even:bg-muted/20 transition-colors border-b border-muted/50"
                  onClick={() => openEdit(app)}
                >
                  <TableCell className="font-medium text-[13px] whitespace-nowrap">
                    <HighlightedText
                      text={app.companyName}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    <HighlightedText
                      text={app.jobTitle || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const opt = STATUS_OPTIONS.find(
                        (s) => s.value === app.status,
                      );
                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${opt?.color || "bg-gray-100 text-gray-700"}`}
                        >
                          <HighlightedText
                            text={app.status}
                            highlight={searchQuery}
                          />
                        </span>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    <HighlightedText
                      text={app.location || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    <HighlightedText
                      text={app.salary || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    <HighlightedText
                      text={app.source || "~"}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell>
                    {priorityBadge(app.priority, searchQuery)}
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap pr-1">
                    <HighlightedText
                      text={formatDate(app.dateApplication)}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap w-[60px] px-0">
                    <div className="flex items-center justify-center gap-1.5 opacity-50">
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-[11px] font-medium">
                        {(() => {
                          const days = timeApplicationToLastRelaunch(app);
                          if (days === null) return "~";
                          return `${days}j`;
                        })()}
                      </span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    <HighlightedText
                      text={formatDate(getLatestRelaunchDate(app))}
                      highlight={searchQuery}
                    />
                  </TableCell>
                  <TableCell>
                    {(app.relaunches?.length || 0) > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <RotateCcw className="h-3 w-3" />
                        <HighlightedText
                          text={app.relaunches.length}
                          highlight={searchQuery}
                        />
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[13px]">
                        <HighlightedText text="~" highlight={searchQuery} />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {app.applicationUrl ? (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      "~"
                    )}
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
