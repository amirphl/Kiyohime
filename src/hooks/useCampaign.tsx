import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CampaignSegment {
  customerType?: string;
  ageRange?: string;
  location?: string;
  interests?: string[];
  customFilters: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
}

export interface CampaignContent {
  messageText: string;
  senderName?: string;
}

export interface CampaignBudget {
  totalBudget: number;
  costPerMessage: number;
  estimatedMessages: number;
  maxSpend: number;
}

export interface CampaignPayment {
  paymentMethod: string;
  termsAccepted: boolean;
}

export interface CampaignData {
  uuid: string;
  segment: CampaignSegment;
  content: CampaignContent;
  budget: CampaignBudget;
  payment: CampaignPayment;
}

interface CampaignContextType {
  currentStep: number;
  campaignData: CampaignData;
  isLoading: boolean;
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
  
  // API operations
  createCampaign: () => Promise<void>;
  saveStepData: (step: number) => Promise<void>;
  finishCampaign: () => Promise<void>;
  
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
  children: React.ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a UUID for the campaign immediately
  const generateUUID = useCallback(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }, []);

  const [campaignData, setCampaignData] = useState<CampaignData>(() => ({
    uuid: generateUUID(), // Set UUID immediately
    segment: {
      customFilters: [],
    },
    content: {
      messageText: '',
    },
    budget: {
      totalBudget: 0,
      costPerMessage: 50,
      estimatedMessages: 0,
      maxSpend: 0,
    },
    payment: {
      paymentMethod: '',
      termsAccepted: false,
    },
  }));

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  const updateSegment = useCallback((data: Partial<CampaignSegment>) => {
    setCampaignData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        ...data,
      },
    }));
  }, []);

  const updateContent = useCallback((data: Partial<CampaignContent>) => {
    setCampaignData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        ...data,
      },
    }));
  }, []);

  const updateBudget = useCallback((data: Partial<CampaignBudget>) => {
    setCampaignData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        ...data,
      },
    }));
  }, []);

  const updatePayment = useCallback((data: Partial<CampaignPayment>) => {
    setCampaignData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...data,
      },
    }));
  }, []);

  const saveStepData = useCallback(async (step: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Call backend API to save step data
      // const response = await apiService.saveCampaignStep(campaignData.uuid, step, campaignData);
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Step ${step} data saved:`, campaignData);
    } catch (err) {
      setError('Failed to save step data. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [campaignData]);

  const createCampaign = useCallback(async () => {
    // Campaign is already initialized with UUID
    // TODO: Call backend API to create new campaign if needed
    // const response = await apiService.createCampaign();
    console.log('Campaign created with UUID:', campaignData.uuid);
  }, [campaignData.uuid]);

  const finishCampaign = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Call backend API to finish campaign creation
      // const response = await apiService.finishCampaign(campaignData.uuid);
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Campaign finished:', campaignData);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Failed to finish campaign. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [campaignData]);

  const resetCampaign = useCallback(() => {
    setCurrentStep(1);
    setCampaignData({
      uuid: '',
      segment: {
        customFilters: [],
      },
      content: {
        messageText: '',
      },
      budget: {
        totalBudget: 0,
        costPerMessage: 50,
        estimatedMessages: 0,
        maxSpend: 0,
      },
      payment: {
        paymentMethod: '',
        termsAccepted: false,
      },
    });
    setError(null);
  }, []);

  const value: CampaignContextType = {
    currentStep,
    campaignData,
    isLoading,
    error,
    nextStep,
    previousStep,
    goToStep,
    updateSegment,
    updateContent,
    updateBudget,
    updatePayment,
    createCampaign,
    saveStepData,
    finishCampaign,
    resetCampaign,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}; 