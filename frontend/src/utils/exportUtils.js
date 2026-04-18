import ExcelJS from "exceljs";
import { getLatestRelaunchDate } from "./applicationUtils";

export const handleExportJSON = (applications) => {
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

export const handleExportCSV = (applications) => {
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

  const rows = applications.map((app) => [
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
        .join(";")
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
    `suivi_candidatures_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleExportXLS = async (applications) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Suivi Candidatures");

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

  applications.forEach((app, i) => {
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
