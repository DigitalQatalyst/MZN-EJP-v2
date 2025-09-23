// /src/hooks/useAutoSave.ts
import { useState, useEffect, useRef } from "react";
import { saveOnboardingProgress } from "../services/onboardingService";

export function useAutoSave(formData, currentStep, isEditingWelcome) {
  const [autoSaving, setAutoSaving] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef({});

  const hasFormDataChanged = () => {
    if (currentStep === 0 && !isEditingWelcome) return false;

    const currentKeys = Object.keys(formData);
    const savedKeys = Object.keys(lastSavedDataRef.current);

    if (currentKeys.length !== savedKeys.length) return true;

    return currentKeys.some(
      (key) => formData[key] !== lastSavedDataRef.current[key]
    );
  };

  const autoSaveFormData = async () => {
    if (!hasFormDataChanged()) return;

    setAutoSaving(true);
    try {
      // NOW USING IndexedDB via the service
      await saveOnboardingProgress({
        ...formData,
        currentStep,
        isEditingWelcome,
        autoSavedAt: new Date().toISOString()
      });

      lastSavedDataRef.current = { ...formData };
      setProgressSaved(true);

      console.log('💾 Auto-saved to IndexedDB:', formData);
      setTimeout(() => setProgressSaved(false), 3000);
    } catch (error) {
      console.error("Error auto-saving progress:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  const saveProgress = async () => {
    if (Object.keys(formData).length === 0) return;

    setSavingProgress(true);
    try {
      await autoSaveFormData();
    } finally {
      setSavingProgress(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (Object.keys(formData).length > 0 && hasFormDataChanged()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(autoSaveFormData, 2000) as any;
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, currentStep, isEditingWelcome]);

  return {
    autoSaving,
    progressSaved,
    savingProgress,
    saveProgress,
  };
}