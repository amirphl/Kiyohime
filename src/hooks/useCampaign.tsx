import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import {
  CustomerLevel,
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
  updateLevel: (data: Partial<CustomerLevel>) => void;
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
        // Backfill shortLinkDomain and lineNumber for existing stored drafts
        if (!parsedData.content) parsedData.content = {};
        if (!parsedData.content.shortLinkDomain) {
          parsedData.content.shortLinkDomain = 'jo1n.ir';
        }
        if (!('lineNumber' in parsedData.content))
          parsedData.content.lineNumber = '';
        if (parsedData.level) {
          if (!('jobCategory' in parsedData.level))
            parsedData.level.jobCategory = '';
          if (!('job' in parsedData.level)) parsedData.level.job = '';
          if (!('platform' in parsedData.level))
            parsedData.level.platform = 'sms';
        }
        if (parsedData.content) {
          if (!('platformSettingsId' in parsedData.content))
            parsedData.content.platformSettingsId = null;
          if (!('mediaUuid' in parsedData.content))
            parsedData.content.mediaUuid = null;
          if ('mediaAttachment' in parsedData.content)
            delete parsedData.content.mediaAttachment;
        }
        return parsedData;
      } catch (error) {
        console.warn('Failed to parse saved campaign data:', error);
      }
    }

    // Default campaign data
    const defaultData = {
      uuid: '',
      level: {
        campaignTitle: '',
        level1: '',
        level2s: [],
        level3s: [],
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
    };

    return defaultData;
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

  const updateLevel = useCallback((data: Partial<CustomerLevel>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        level: {
          ...prev.level,
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
      level: {
        campaignTitle: '',
        level1: '', // Level 1
        level2s: [], // Level 2s
        level3s: [], // Level 3s
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
      level: {
        campaignTitle: '',
        level1: '', // Level 1
        level2s: [], // Level 2s
        level3s: [], // Level 3s
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
    if (
      campaignData.level.campaignTitle &&
      campaignData.level.level1 &&
      campaignData.level.level3s.length > 0 &&
      (!isAgency || (campaignData.level.jobCategory && campaignData.level.job))
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
      (campaignData.level.platform === 'sms'
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
