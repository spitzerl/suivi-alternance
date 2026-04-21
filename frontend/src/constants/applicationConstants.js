export const STATUS_OPTIONS = [
  {
    value: "En attente",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  },
  {
    value: "Entretien",
    color:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border border-sky-200 dark:border-sky-800",
  },
  {
    value: "Acceptée",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  },
  {
    value: "Refusée",
    color:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
  },
  {
    value: "Abandonnée",
    color:
      "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  },
  {
    value: "Relancée",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800",
  },
];

export const STATUS_ORDER = {
  Acceptée: 0,
  Entretien: 1,
  Relancée: 2,
  "En attente": 3,
  Refusée: 4,
  Abandonnée: 5,
};

export const INACTIVE_STATUSES = ["Refusée", "Abandonnée"];

export const METHOD_OPTIONS = [
  "Email",
  "Téléphone",
  "LinkedIn",
  "Courrier",
  "Autre",
];

export const EMPTY_FORM = {
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

export const EMPTY_RELAUNCH_FORM = {
  date: new Date().toISOString().split("T")[0],
  method: "",
  notes: "",
  response: "",
};

export const COLUMNS = [
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
