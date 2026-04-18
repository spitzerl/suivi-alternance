import { useState, useMemo } from "react";
import api from "@/api";
import { EMPTY_RELAUNCH_FORM } from "@/constants/applicationConstants";

export default function useRelaunches(applicationId, onUpdate) {
  const [relaunches, setRelaunches] = useState([]);
  const [relaunchForm, setRelaunchForm] = useState(EMPTY_RELAUNCH_FORM);
  const [showRelaunchForm, setShowRelaunchForm] = useState(false);
  const [editingRelaunchId, setEditingRelaunchId] = useState(null);
  const [savingRelaunch, setSavingRelaunch] = useState(false);
  const [relaunchesExpanded, setRelaunchesExpanded] = useState(false);

  const handleRelaunchChange = (field, value) => {
    setRelaunchForm((prev) => ({ ...prev, [field]: value }));
  };

  const openNewRelaunch = () => {
    setRelaunchForm(EMPTY_RELAUNCH_FORM);
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
    setRelaunchForm(EMPTY_RELAUNCH_FORM);
  };

  const handleRelaunchSubmit = async () => {
    if (!applicationId) return;
    setSavingRelaunch(true);
    const payload = {
      ...relaunchForm,
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
          `/applications/${applicationId}/relaunches/${editingRelaunchId}`,
          payload,
        );
        setRelaunches((prev) =>
          prev.map((r) => (r.id === editingRelaunchId ? res.data : r)),
        );
      } else {
        const res = await api.post(
          `/applications/${applicationId}/relaunches`,
          payload,
        );
        setRelaunches((prev) => [...prev, res.data]);
      }
      cancelRelaunchForm();
      if (onUpdate) onUpdate();
    } catch (err) {
      throw err;
    } finally {
      setSavingRelaunch(false);
    }
  };

  const deleteRelaunch = async (relaunchId) => {
    if (!applicationId) return;
    try {
      await api.delete(
        `/applications/${applicationId}/relaunches/${relaunchId}`,
      );
      setRelaunches((prev) => prev.filter((r) => r.id !== relaunchId));
      if (onUpdate) onUpdate();
    } catch (err) {
      throw err;
    }
  };

  const sortedRelaunches = useMemo(() => {
    return [...relaunches].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [relaunches]);

  return {
    relaunches,
    setRelaunches,
    relaunchForm,
    showRelaunchForm,
    editingRelaunchId,
    savingRelaunch,
    relaunchesExpanded,
    setRelaunchesExpanded,
    handleRelaunchChange,
    openNewRelaunch,
    toggleEditRelaunch,
    cancelRelaunchForm,
    handleRelaunchSubmit,
    deleteRelaunch,
    sortedRelaunches,
  };
}
