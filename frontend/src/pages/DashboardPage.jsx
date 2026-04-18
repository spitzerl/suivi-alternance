import { useState } from "react";
import api from "@/api";
import useApplications from "@/hooks/useApplications";
import useRelaunches from "@/hooks/useRelaunches";
import { EMPTY_FORM } from "@/constants/applicationConstants";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicationDialog from "@/components/dashboard/ApplicationDialog";

export default function DashboardPage() {
  const {
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
  } = useApplications();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const relaunchProps = useRelaunches(editingId, fetchApplications);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    relaunchProps.setRelaunches([]);
    relaunchProps.setRelaunchesExpanded(false);
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
    relaunchProps.setRelaunches(app.relaunches || []);
    relaunchProps.setRelaunchesExpanded((app.relaunches || []).length > 0);
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

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await api.post("/applications/bulk", json);
        fetchApplications();
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors de l'importation.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-6 py-10 space-y-6">
      <DashboardHeader
        applicationCount={filteredApplications.length}
        totalCount={applications.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onImportJSON={handleImportJSON}
        onAddNew={openNew}
        filteredApplications={filteredApplications}
      />

      <FilterBar 
        filters={filters}
        toggleFilter={toggleFilter}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        relaunchThreshold={relaunchThreshold}
        setRelaunchThreshold={setRelaunchThreshold}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          Chargement…
        </p>
      ) : (
        <ApplicationTable 
          applications={filteredApplications}
          sortConfig={sortConfig}
          handleSort={handleSort}
          searchQuery={searchQuery}
          onEdit={openEdit}
          relaunchThreshold={relaunchThreshold}
        />
      )}

      <ApplicationDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingId}
        form={form}
        error={error}
        saving={saving}
        onChange={handleChange}
        onSubmit={handleSubmit}
        relaunchProps={{
          ...relaunchProps,
          onRelaunchChange: relaunchProps.handleRelaunchChange,
          onOpenNewRelaunch: relaunchProps.openNewRelaunch,
          onToggleEditRelaunch: relaunchProps.toggleEditRelaunch,
          onCancelRelaunch: relaunchProps.cancelRelaunchForm,
          onRelaunchSubmit: relaunchProps.handleRelaunchSubmit,
          onDeleteRelaunch: relaunchProps.deleteRelaunch,
        }}
      />
    </div>
  );
}
