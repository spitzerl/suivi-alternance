export const formatDate = (d) => {
  if (!d) return "~";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getLatestRelaunchDate = (app) => {
  if (!app.relaunches || app.relaunches.length === 0) return null;
  const dates = app.relaunches.map((r) => new Date(r.date).getTime());
  return Math.max(...dates);
};

export const timeApplicationToLastRelaunch = (app) => {
  if (!app.dateApplication) return null;
  const lastRelaunch = getLatestRelaunchDate(app);
  if (!lastRelaunch) return null;

  const start = new Date(app.dateApplication);
  const end = new Date(lastRelaunch);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
