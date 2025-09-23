import { saveProfileData } from "./DataverseService";
import { OnboardingDB } from "../utils/onboardingDB";

// Initialize database instance
let dbInstance: OnboardingDB | null = null;

// Initialize database (call this once when app starts)
export const initializeOnboardingDB = async (): Promise<void> => {
  if (!dbInstance) {
    dbInstance = new OnboardingDB();
    await dbInstance.init();
    console.log('✅ Onboarding IndexedDB initialized');
  }
};

// Check if user has completed onboarding - UNCHANGED (keeps using localStorage)
export const checkOnboardingStatus = async (): Promise<boolean> => {
  // Keep using localStorage for the completion flag
  const onboardingStatus = localStorage.getItem("onboardingComplete");
  if (onboardingStatus === "true") {
    return true;
  }
  
  try {
    // Simulate API call to check if profile data exists
    const response = await fetch("/api/onboarding/status");
    const data = await response.json();
    return data.isComplete;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};

// Get saved progress from IndexedDB
export const getOnboardingProgress = async (): Promise<any | null> => {
  try {
    if (dbInstance) {
      const progress = await dbInstance.loadDraft();
      if (progress) {
        console.log('📂 Loaded progress from IndexedDB:', progress);
        return progress;
      }
    }

    // Fallback: check localStorage for old progress
    const legacyProgress = localStorage.getItem("onboardingProgress");
    if (legacyProgress) {
      console.log('📂 Found legacy progress in localStorage, migrating...');
      const parsed = JSON.parse(legacyProgress);
      
      // Migrate to IndexedDB
      if (dbInstance) {
        await dbInstance.saveDraft(parsed);
        // Clean up localStorage after migration
        localStorage.removeItem("onboardingProgress");
      }
      
      return parsed;
    }

    return null;
  } catch (error) {
    console.error("Error getting onboarding progress:", error);
    return null;
  }
};

// Save onboarding progress - FIXED: IndexedDB only, no Dataverse call
export const saveOnboardingProgress = async (formData: any): Promise<boolean> => {
  try {
    console.log('💾 Saving onboarding progress (auto-save)...');

    // 1. Save rich data to IndexedDB ONLY
    if (dbInstance) {
      const success = await dbInstance.saveDraft({
        ...formData,
        lastSaved: new Date().toISOString(),
        saveType: 'progress' // distinguish from final submission
      });
      
      if (success) {
        console.log('✅ Progress saved to IndexedDB (auto-save only)');
        return true;
      } else {
        console.warn('⚠️ IndexedDB save failed, using localStorage backup');
        // Fallback: save to localStorage if IndexedDB fails
        localStorage.setItem("onboardingProgress", JSON.stringify(formData));
        return true;
      }
    } else {
      // Fallback: save to localStorage if IndexedDB not ready
      localStorage.setItem("onboardingProgress", JSON.stringify(formData));
      return true;
    }

    // 2. REMOVED: Don't save to Dataverse for auto-saves
    // This was causing premature completion by calling saveProfileData()

  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    throw error;
  }
};

// NEW: Manual save progress function (saves to both IndexedDB and Dataverse)
export const saveOnboardingProgressManual = async (formData: any): Promise<boolean> => {
  try {
    console.log('💾 Saving progress manually to both IndexedDB and Dataverse...');

    // 1. Save to IndexedDB first
    await saveOnboardingProgress(formData);

    // 2. Save partial data to Dataverse (your existing logic)
    const partialData: any = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] && formData[key].toString().trim() !== "") {
        partialData[key] = formData[key];
      }
    });

    if (Object.keys(partialData).length > 0) {
      const structuredData = transformPartialFormDataToDataverseFormat(partialData);
      await saveProfileData(structuredData);
      console.log('✅ Progress also saved to Dataverse');
    }

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error("Error saving progress manually:", error);
    throw error;
  }
};

// Save final onboarding data - ONLY THIS sets onboardingComplete = true
export const saveOnboardingData = async (formData: any): Promise<boolean> => {
  try {
    console.log('💾 Saving final onboarding data...');

    // Clean the form data
    const cleanedData: any = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        cleanedData[key] = formData[key].trim();
      } else {
        cleanedData[key] = formData[key];
      }
    });

    // 1. Save final data to IndexedDB
    if (dbInstance) {
      await dbInstance.saveDraft({
        ...cleanedData,
        lastSaved: new Date().toISOString(),
        saveType: 'final',
        completedAt: new Date().toISOString()
      });
      console.log('✅ Final data saved to IndexedDB');
    }

    // 2. Save to Dataverse (your existing logic)
    const structuredData = transformFormDataToDataverseFormat(cleanedData);
    await saveProfileData(structuredData);

    // 3. Mark as complete in localStorage (ONLY HERE!)
    localStorage.setItem("onboardingComplete", "true");
    console.log('✅ Onboarding marked as complete in localStorage');

    return true;
  } catch (error) {
    console.error("Error saving final onboarding data:", error);
    throw error;
  }
};

// Clear onboarding data (useful for testing)
export const clearOnboardingData = async (): Promise<void> => {
  try {
    // Clear IndexedDB
    if (dbInstance) {
      // We'll add a clear method to the OnboardingDB class
      console.log('🗑️ Clearing IndexedDB data...');
    }

    // Clear localStorage progress (but keep this separate from completion flag)
    localStorage.removeItem("onboardingProgress");
    
    console.log('✅ Onboarding data cleared');
  } catch (error) {
    console.error("Error clearing onboarding data:", error);
  }
};

// Helper function to transform partial form data into structured Dataverse format
function transformPartialFormDataToDataverseFormat(partialData: any) {
  const sections: any = {};

  const basicFields = [
    "tradeName", "industry", "businessSize", "registrationNumber", 
    "establishmentDate", "businessPitch", "problemStatement", 
    "employeeCount", "founders", "foundingYear", "initialCapital", 
    "fundingNeeds", "needsList",
  ];

  const contactFields = [
    "contactName", "email", "phone", "address", "city", "country", "website",
  ];

  const hasBasicFields = basicFields.some((field) => field in partialData);
  if (hasBasicFields) {
    sections.basic = { fields: {}, status: {} };
    basicFields.forEach((field) => {
      if (field in partialData) {
        sections.basic.fields[field] = partialData[field];
        sections.basic.status[field] = "completed";
      }
    });
  }

  const hasContactFields = contactFields.some((field) => field in partialData);
  if (hasContactFields) {
    sections.contact = { fields: {}, status: {} };
    contactFields.forEach((field) => {
      if (field in partialData) {
        sections.contact.fields[field] = partialData[field];
        sections.contact.status[field] = "completed";
      }
    });
  }

  return {
    id: partialData.id || generateTemporaryId(),
    name: partialData.tradeName || "Company Name",
    companyType: partialData.industry || "Industry",
    companySize: partialData.businessSize || "Company Size",
    companyStage: partialData.companyStage || "startup",
    sections,
  };
}

// Helper function to transform form data into structured Dataverse format
function transformFormDataToDataverseFormat(formData: any) {
  const sections = {
    basic: {
      fields: {
        tradeName: formData.tradeName || "",
        industry: formData.industry || "",
        businessSize: formData.businessSize || "",
        registrationNumber: formData.registrationNumber || "",
        establishmentDate: formData.establishmentDate || "",
        businessPitch: formData.businessPitch || "",
        problemStatement: formData.problemStatement || "",
        employeeCount: formData.employeeCount || "",
        founders: formData.founders || "",
        foundingYear: formData.foundingYear || "",
        initialCapital: formData.initialCapital || "",
        fundingNeeds: formData.fundingNeeds || "",
        needsList: formData.needsList || "",
      },
      status: {
        tradeName: "completed",
        industry: "completed",
        businessSize: "completed",
        registrationNumber: "completed",
        establishmentDate: "completed",
        businessPitch: "completed",
        problemStatement: "completed",
        employeeCount: "completed",
        founders: "completed",
        foundingYear: "completed",
        initialCapital: "completed",
        fundingNeeds: formData.fundingNeeds ? "completed" : "editable",
        needsList: "completed",
      },
    },
    contact: {
      fields: {
        contactName: formData.contactName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "",
        website: formData.website || "",
      },
      status: {
        contactName: "completed",
        email: "completed",
        phone: "completed",
        address: "completed",
        city: "completed",
        country: "completed",
        website: formData.website ? "completed" : "editable",
      },
    },
  };

  return {
    id: formData.id || generateTemporaryId(),
    name: formData.tradeName || "Company Name",
    companyType: formData.industry || "Industry",
    companySize: formData.businessSize || "Company Size",
    companyStage: formData.companyStage || "startup",
    sections,
  };
}

function generateTemporaryId(): string {
  return Date.now().toString();
}