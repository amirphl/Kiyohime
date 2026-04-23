import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import {
  CampaignSegment,
  CampaignContent,
  CampaignBudget,
  CampaignPayment,
  CampaignData,
} from '../types/campaign';
import { registerCampaignClearFunction } from './useAuth';
import { clearLevelSelection } from '../types/segment';

interface CampaignContextType {
  currentStep: number;
  campaignData: CampaignData;
  error: string | null;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  // Data management
  updateLevel: (data: Partial<CampaignSegment>) => void;
  updateContent: (data: Partial<CampaignContent>) => void;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  updatePayment: (data: Partial<CampaignPayment>) => void;

  // UUID management
  setCampaignUuid: (uuid: string) => void;

  // Storage management
  saveCampaignData: () => void;
  clearCampaignData: () => void;
  clearAllCampaignData: () => void;

  // Campaign status
  hasExistingCampaign: boolean;
  getCampaignProgress: () => {
    completedSteps: number;
    totalSteps: number;
    progress: number;
  };

  // Reset
  resetCampaign: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

type StoredCampaignData = Partial<CampaignData> & {
  level?: Partial<CampaignSegment>;
};

const createDefaultCampaignData = (): CampaignData => ({
  uuid: '',
  segment: {
    campaignTitle: '',
    level1: '',
    level2s: [],
    level3s: [],
    targetAudienceExcelFileUuid: null,
    platform: 'sms',
    tags: [],
    capacityTooLow: false,
    capacity: undefined,
    jobCategory: '',
    job: '',
  },
  content: {
    insertLink: false,
    link: '',
    text: '',
    scheduleAt: undefined,
    shortLinkDomain: 'jo1n.ir',
    lineNumber: '',
    platformSettingsId: null,
    mediaUuid: null,
  },
  budget: {
    totalBudget: 0,
    estimatedMessages: undefined,
  },
  payment: {
    paymentMethod: '',
    termsAccepted: false,
  },
});

const normalizeStoredCampaignData = (data: StoredCampaignData): CampaignData => {
  const defaults = createDefaultCampaignData();
  const storedSegment = data.segment ?? data.level ?? {};
  const { mediaAttachment: _mediaAttachment, ...storedContent } =
    (data.content ?? {}) as Partial<CampaignContent> & {
      mediaAttachment?: unknown;
    };

  return {
    uuid: typeof data.uuid === 'string' ? data.uuid : defaults.uuid,
    segment: {
      ...defaults.segment,
      ...storedSegment,
      level2s: Array.isArray(storedSegment.level2s)
        ? storedSegment.level2s
        : defaults.segment.level2s,
      level3s: Array.isArray(storedSegment.level3s)
        ? storedSegment.level3s
        : defaults.segment.level3s,
      tags: Array.isArray(storedSegment.tags)
        ? storedSegment.tags
        : defaults.segment.tags,
      targetAudienceExcelFileUuid:
        storedSegment.targetAudienceExcelFileUuid ?? null,
      platform: storedSegment.platform || defaults.segment.platform,
      jobCategory: storedSegment.jobCategory || defaults.segment.jobCategory,
      job: storedSegment.job || defaults.segment.job,
    },
    content: {
      ...defaults.content,
      ...storedContent,
      shortLinkDomain:
        storedContent.shortLinkDomain || defaults.content.shortLinkDomain,
      lineNumber: storedContent.lineNumber ?? defaults.content.lineNumber,
      platformSettingsId:
        storedContent.platformSettingsId ?? defaults.content.platformSettingsId,
      mediaUuid: storedContent.mediaUuid ?? defaults.content.mediaUuid,
    },
    budget: {
      ...defaults.budget,
      ...(data.budget ?? {}),
    },
    payment: {
      ...defaults.payment,
      ...(data.payment ?? {}),
    },
  };
};

export const CampaignProvider: React.FC<CampaignProviderProps> = ({
  children,
}) => {
  // Initialize state from localStorage or defaults
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem('campaign_creation_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [campaignData, setCampaignData] = useState<CampaignData>(() => {
    const savedData = localStorage.getItem('campaign_creation_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return normalizeStoredCampaignData(parsedData);
      } catch (error) {
        console.warn('Failed to parse saved campaign data:', error);
      }
    }

    return createDefaultCampaignData();
  });

  const [error, setError] = useState<string | null>(null);

  // Auto-save campaign data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'campaign_creation_data',
      JSON.stringify(campaignData)
    );
  }, [campaignData]);

  // Auto-save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('campaign_creation_step', currentStep.toString());
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const updateLevel = useCallback((data: Partial<CampaignSegment>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        segment: {
          ...prev.segment,
          ...data,
        },
      };
      return updatedData;
    });
  }, []);

  const updateContent = useCallback((data: Partial<CampaignContent>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        content: {
          ...prev.content,
          ...data,
        },
      };
      return updatedData;
    });
  }, []);

  const updateBudget = useCallback((data: Partial<CampaignBudget>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        budget: {
          ...prev.budget,
          ...data,
        },
      };
      return updatedData;
    });
  }, []);

  const updatePayment = useCallback((data: Partial<CampaignPayment>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        payment: {
          ...prev.payment,
          ...data,
        },
      };
      return updatedData;
    });
  }, []);

  const setCampaignUuid = useCallback((uuid: string) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        uuid,
      };
      return updatedData;
    });
  }, []);

  const resetCampaign = useCallback(() => {
    setCurrentStep(1);
    setCampaignData({
      uuid: '', // Reset UUID
      segment: {
        campaignTitle: '',
        level1: '', // Level 1
        level2s: [], // Level 2s
        level3s: [], // Level 3s
        targetAudienceExcelFileUuid: null,
        platform: 'sms',
        tags: [], // Union of tags from selected level3s
        capacityTooLow: false,
        capacity: undefined,
        jobCategory: '',
        job: '',
      },
      content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
        shortLinkDomain: 'jo1n.ir',
        lineNumber: '',
        platformSettingsId: null,
        mediaUuid: null,
      },
      budget: {
        totalBudget: 0,
        estimatedMessages: undefined,
      },
      payment: {
        paymentMethod: '',
        termsAccepted: false,
      },
    });
    setError(null);

    // Clear localStorage
    localStorage.removeItem('campaign_creation_data');
    localStorage.removeItem('campaign_creation_step');
    clearLevelSelection(); // Clear dedicated level selection storage
  }, []);

  const saveCampaignData = useCallback(() => {
    localStorage.setItem(
      'campaign_creation_data',
      JSON.stringify(campaignData)
    );
    localStorage.setItem('campaign_creation_step', currentStep.toString());
  }, [campaignData, currentStep]);

  const clearCampaignData = useCallback(() => {
    localStorage.removeItem('campaign_creation_data');
    localStorage.removeItem('campaign_creation_step');
    clearLevelSelection(); // Clear dedicated level selection storage
  }, []);

  // Comprehensive cleanup function for logout scenarios
  const clearAllCampaignData = useCallback(() => {
    // Clear localStorage (includes level selection storage)
    clearCampaignData();

    // Reset state
    setCurrentStep(1);
    setCampaignData({
      uuid: '',
      segment: {
        campaignTitle: '',
        level1: '', // Level 1
        level2s: [], // Level 2s
        level3s: [], // Level 3s
        targetAudienceExcelFileUuid: null,
        platform: 'sms',
        tags: [], // Union of tags from selected level3s
        capacityTooLow: false,
        capacity: undefined,
        jobCategory: '',
        job: '',
      },
      content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
        shortLinkDomain: 'jo1n.ir',
        lineNumber: '',
        platformSettingsId: null,
        mediaUuid: null,
      },
      budget: {
        totalBudget: 0,
        estimatedMessages: undefined,
      },
      payment: {
        paymentMethod: '',
        termsAccepted: false,
      },
    });
    setError(null);
  }, [clearCampaignData]);

  // Register the clear function with auth context for logout scenarios
  useEffect(() => {
    registerCampaignClearFunction(clearAllCampaignData);

    // Cleanup function
    return () => {
      registerCampaignClearFunction(() => {}); // Clear the reference
    };
  }, [clearAllCampaignData]);

  // Check if there's an existing campaign
  const hasExistingCampaign = campaignData.uuid !== '';

  // Get campaign progress information
  const getCampaignProgress = useCallback(() => {
    const totalSteps = 4;
    let completedSteps = 0;

    // Check each step for completion
    // Step 1: Campaign title, level1, and level3s required
    const isAgency =
      typeof window !== 'undefined'
        ? localStorage.getItem('account_type') === 'marketing_agency'
        : false;
    const targetAudienceExcelFileUuid =
      campaignData.segment.targetAudienceExcelFileUuid;
    const isTargetAudienceExcelFileMode = targetAudienceExcelFileUuid != null;
    const excelFileUploaded =
      typeof targetAudienceExcelFileUuid === 'string' &&
      targetAudienceExcelFileUuid.trim().length > 0;
    if (
      campaignData.segment.campaignTitle &&
      campaignData.segment.level1 &&
      campaignData.segment.level3s.length > 0 &&
      (!isTargetAudienceExcelFileMode || excelFileUploaded) &&
      (!isAgency ||
        (campaignData.segment.jobCategory && campaignData.segment.job))
    ) {
      completedSteps++;
    }
    if (
      campaignData.content.text &&
      (!campaignData.content.insertLink ||
        (campaignData.content.insertLink && campaignData.content.link))
    ) {
      completedSteps++;
    }
    if (
      (campaignData.segment.platform === 'sms'
        ? campaignData.content.lineNumber
        : campaignData.content.platformSettingsId) &&
      campaignData.budget.totalBudget > 0
    ) {
      completedSteps++;
    }
    if (
      campaignData.payment.paymentMethod &&
      campaignData.payment.termsAccepted
    ) {
      completedSteps++;
    }

    const progress = (completedSteps / totalSteps) * 100;

    return {
      completedSteps,
      totalSteps,
      progress: Math.round(progress),
    };
  }, [campaignData]);

  const value: CampaignContextType = {
    currentStep,
    campaignData,
    error,
    nextStep,
    previousStep,
    goToStep,
    updateLevel,
    updateContent,
    updateBudget,
    updatePayment,
    setCampaignUuid,
    saveCampaignData,
    clearCampaignData,
    clearAllCampaignData,
    hasExistingCampaign,
    getCampaignProgress,
    resetCampaign,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};
