export const STATUS_OPTIONS = [
  {
    value: "En attente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "Entretien",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "Acceptée",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
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
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
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

export const METHOD_OPTIONS = ["Email", "Téléphone", "LinkedIn", "Courrier", "Autre"];

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
