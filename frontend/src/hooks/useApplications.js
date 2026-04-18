import { useState, useEffect, useMemo, useCallback } from "react";
import api from "@/api";
import {
  STATUS_ORDER,
  INACTIVE_STATUSES,
} from "@/constants/applicationConstants";
import {
  getLatestRelaunchDate,
  timeApplicationToLastRelaunch,
  formatDate,
  checkNeedsRelaunch,
} from "@/utils/applicationUtils";

export default function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "dateApplication",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    hideInactive: true,
    status: "All",
    priority: "All",
    needsRelaunch: false,
  });
  const [relaunchThreshold, setRelaunchThreshold] = useState(10);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setApplications(res.data);
      setError("");
    } catch (err) {
      setError("Impossible de charger les candidatures.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

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
    return [...applications].sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key];
      let valB = b[key];

      if (key === "relaunches") {
        valA = a.relaunches?.length || 0;
        valB = b.relaunches?.length || 0;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "lastRelaunch") {
        valA = getLatestRelaunchDate(a);
        valB = getLatestRelaunchDate(b);
        if (valA === null && valB === null) return 0;
        if (valA === null) return 1;
        if (valB === null) return -1;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "timeBetween") {
        valA = timeApplicationToLastRelaunch(a);
        valB = timeApplicationToLastRelaunch(b);
        if (valA === null && valB === null) return 0;
        if (valA === null) return 1;
        if (valB === null) return -1;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "status") {
        valA = STATUS_ORDER[valA] ?? 99;
        valB = STATUS_ORDER[valB] ?? 99;
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (key === "priority") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "dateApplication") {
        const dA = new Date(valA).getTime();
        const dB = new Date(valB).getTime();
        return direction === "asc" ? dA - dB : dB - dA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      const cmp = strA.localeCompare(strB, "fr");
      return direction === "asc" ? cmp : -cmp;
    });
  }, [applications, sortConfig]);

  const filteredApplications = useMemo(() => {
    let result = [...sortedApplications];

    if (filters.hideInactive) {
      result = result.filter((app) => !INACTIVE_STATUSES.includes(app.status));
    }

    if (filters.status !== "All") {
      result = result.filter((app) => app.status === filters.status);
    }

    if (filters.priority !== "All") {
      result = result.filter(
        (app) => app.priority === parseInt(filters.priority),
      );
    }

    if (filters.needsRelaunch) {
      result = result.filter((app) =>
        checkNeedsRelaunch(app, relaunchThreshold)
      );
    }

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
  }, [sortedApplications, searchQuery, filters, relaunchThreshold]);

  const fieldSuggestions = useMemo(() => {
    const suggestions = {
      companies: new Set(),
      titles: new Set(),
      locations: new Set(),
      sources: new Set(),
    };

    applications.forEach((app) => {
      if (app.companyName) suggestions.companies.add(app.companyName);
      if (app.jobTitle) suggestions.titles.add(app.jobTitle);
      if (app.location) suggestions.locations.add(app.location);
      if (app.source) suggestions.sources.add(app.source);
    });

    return {
      companies: Array.from(suggestions.companies).sort(),
      titles: Array.from(suggestions.titles).sort(),
      locations: Array.from(suggestions.locations).sort(),
      sources: Array.from(suggestions.sources).sort(),
    };
  }, [applications]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      hideInactive: true,
      status: "All",
      priority: "All",
      needsRelaunch: false,
    });
  };

  return {
    applications,
    loading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    filters,
    toggleFilter,
    handleFilterChange,
    resetFilters,
    filteredApplications,
    fetchApplications,
    relaunchThreshold,
    setRelaunchThreshold,
    fieldSuggestions,
  };
}
