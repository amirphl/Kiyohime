import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CustomerSegment, CampaignContent, CampaignBudget, CampaignPayment, CampaignData } from '../types/campaign';
import { registerCampaignClearFunction } from './useAuth';

// Use CustomerSegment from types file
export type CampaignSegment = CustomerSegment;

interface CampaignContextType {
  currentStep: number;
  campaignData: CampaignData;
  error: string | null;
  
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  
  // Data management
  updateSegment: (data: Partial<CampaignSegment>) => void;
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
  getCampaignProgress: () => { completedSteps: number; totalSteps: number; progress: number };
  
  // Reset
  resetCampaign: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

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

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
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
        console.log('📂 Loading existing campaign data from localStorage:', parsedData);
        console.log('🔍 Campaign data details:', {
          hasUUID: !!parsedData.uuid,
          hasSegmentData: !!parsedData.segment,
          segmentFields: parsedData.segment ? Object.keys(parsedData.segment) : [],
          hasContentData: !!parsedData.content,
          hasBudgetData: !!parsedData.budget,
          hasPaymentData: !!parsedData.payment,
        });
        return parsedData;
      } catch (error) {
        console.warn('Failed to parse saved campaign data:', error);
      }
    }
    
    // Default campaign data
    const defaultData = {
    uuid: '',
    segment: {
        campaignTitle: '',
        segment: '',
        subsegments: [],
        sex: '',
        city: [],
        capacityTooLow: false,
        capacity: undefined,
    },
    content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
    },
    budget: {
        lineNumber: '',
      totalBudget: 0,
        estimatedMessages: undefined,
    },
    payment: {
      paymentMethod: '',
      termsAccepted: false,
    },
    };
    
    console.log('🆕 Using default campaign data (no saved data found)');
    return defaultData;
  });
  
  const [error, setError] = useState<string | null>(null);

  // Auto-save campaign data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('campaign_creation_data', JSON.stringify(campaignData));
    console.log('💾 Campaign data automatically saved to localStorage:', {
      uuid: campaignData.uuid,
      currentStep,
      hasSegmentData: Object.keys(campaignData.segment).length > 0,
      hasContentData: Object.keys(campaignData.content).length > 0,
      hasBudgetData: Object.keys(campaignData.budget).length > 0,
      hasPaymentData: Object.keys(campaignData.payment).length > 0,
    });
    
    // Additional debug info for segment data
    if (campaignData.segment.campaignTitle || campaignData.segment.segment || campaignData.segment.subsegments.length > 0) {
      console.log('📝 Segment data being saved:', {
        title: campaignData.segment.campaignTitle,
        segment: campaignData.segment.segment,
        subsegments: campaignData.segment.subsegments,
        sex: campaignData.segment.sex,
        city: campaignData.segment.city,
        capacity: campaignData.segment.capacity,
      });
    }
  }, [campaignData, currentStep]);

  // Auto-save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('campaign_creation_step', currentStep.toString());
    console.log('📍 Current step saved to localStorage:', currentStep);
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      console.log(`🔄 Navigating from step ${currentStep} to step ${newStep}`);
      setCurrentStep(newStep);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      console.log(`🔄 Navigating from step ${currentStep} to step ${newStep}`);
      setCurrentStep(newStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      console.log(`🔄 Navigating directly to step ${step} from step ${currentStep}`);
      setCurrentStep(step);
    }
  }, [currentStep]);

  const updateSegment = useCallback((data: Partial<CampaignSegment>) => {
    console.log('📝 Updating segment data:', data);
    setCampaignData(prev => {
      const updatedData = {
      ...prev,
      segment: {
        ...prev.segment,
        ...data,
      },
      };
      console.log('✅ Segment data updated, new state:', updatedData);
      return updatedData;
    });
  }, []);

  const updateContent = useCallback((data: Partial<CampaignContent>) => {
    console.log('📝 Updating content data:', data);
    setCampaignData(prev => {
      const updatedData = {
      ...prev,
      content: {
        ...prev.content,
        ...data,
      },
      };
      console.log('✅ Content data updated, new state:', updatedData);
      return updatedData;
    });
  }, []);

  const updateBudget = useCallback((data: Partial<CampaignBudget>) => {
    console.log('📝 Updating budget data:', data);
    setCampaignData(prev => {
      const updatedData = {
      ...prev,
      budget: {
        ...prev.budget,
        ...data,
      },
      };
      console.log('✅ Budget data updated, new state:', updatedData);
      return updatedData;
    });
  }, []);

  const updatePayment = useCallback((data: Partial<CampaignPayment>) => {
    console.log('📝 Updating payment data:', data);
    setCampaignData(prev => {
      const updatedData = {
      ...prev,
      payment: {
        ...prev.payment,
        ...data,
      },
      };
      console.log('✅ Payment data updated, new state:', updatedData);
      return updatedData;
    });
  }, []);

  const setCampaignUuid = useCallback((uuid: string) => {
    console.log('🆔 Setting campaign UUID:', uuid);
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        uuid,
      };
      console.log('✅ Campaign UUID updated, new state:', updatedData);
      return updatedData;
    });
  }, []);

  const resetCampaign = useCallback(() => {
    setCurrentStep(1);
    setCampaignData({
      uuid: '', // Reset UUID
      segment: {
        campaignTitle: '',
        segment: '',
        subsegments: [],
        sex: '',
        city: [],
        capacityTooLow: false,
        capacity: undefined,
      },
      content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
      },
      budget: {
        lineNumber: '',
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
  }, []);

  const saveCampaignData = useCallback(() => {
    localStorage.setItem('campaign_creation_data', JSON.stringify(campaignData));
    localStorage.setItem('campaign_creation_step', currentStep.toString());
  }, [campaignData, currentStep]);

  const clearCampaignData = useCallback(() => {
    console.log('🧹 Clearing campaign data from localStorage...');
    localStorage.removeItem('campaign_creation_data');
    localStorage.removeItem('campaign_creation_step');
    console.log('✅ Campaign data cleared');
  }, []);

  // Comprehensive cleanup function for logout scenarios
  const clearAllCampaignData = useCallback(() => {
    console.log('🚨 Performing comprehensive campaign data cleanup...');
    
    // Clear localStorage
    clearCampaignData();
    
    // Reset state
    setCurrentStep(1);
    setCampaignData({
      uuid: '',
      segment: {
        campaignTitle: '',
        segment: '',
        subsegments: [],
        sex: '',
        city: [],
        capacityTooLow: false,
        capacity: undefined,
      },
      content: {
        insertLink: false,
        link: '',
        text: '',
        scheduleAt: undefined,
      },
      budget: {
        lineNumber: '',
        totalBudget: 0,
        estimatedMessages: undefined,
      },
      payment: {
        paymentMethod: '',
        termsAccepted: false,
      },
    });
    setError(null);
    
    console.log('✅ All campaign data cleared and state reset');
  }, [clearCampaignData]);

  // Register the clear function with auth context for logout scenarios
  useEffect(() => {
    registerCampaignClearFunction(clearAllCampaignData);
    console.log('🔗 Campaign clear function registered with auth context');
    
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
    if (campaignData.segment.campaignTitle && campaignData.segment.segment && campaignData.segment.subsegments.length > 0 && campaignData.segment.sex && campaignData.segment.city.length > 0) {
      completedSteps++;
    }
    if (campaignData.content.text && (!campaignData.content.insertLink || (campaignData.content.insertLink && campaignData.content.link))) {
      completedSteps++;
    }
    if (campaignData.budget.lineNumber && campaignData.budget.totalBudget > 0) {
      completedSteps++;
    }
    if (campaignData.payment.paymentMethod && campaignData.payment.termsAccepted) {
      completedSteps++;
    }
    
    const progress = (completedSteps / totalSteps) * 100;
    
    return {
      completedSteps,
      totalSteps,
      progress: Math.round(progress)
    };
  }, [campaignData]);

  const value: CampaignContextType = {
    currentStep,
    campaignData,
    error,
    nextStep,
    previousStep,
    goToStep,
    updateSegment,
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