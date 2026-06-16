import {
  CampaignBudget,
  CampaignContent,
  CampaignData,
  CampaignPayment,
  CampaignSegment,
} from '../types/campaign';
import { clearLevelSelection, saveLevelSelection } from '../types/segment';

export const createCampaignCreationDraft = (overrides?: {
  uuid?: string;
  segment?: Partial<CampaignSegment>;
  content?: Partial<CampaignContent>;
  budget?: Partial<CampaignBudget>;
  payment?: Partial<CampaignPayment>;
}): CampaignData => {
  const {
    segment: segmentOverrides,
    content: contentOverrides,
    budget: budgetOverrides,
    payment: paymentOverrides,
    ...campaignOverrides
  } = overrides ?? {};

  return {
    uuid: '',
    ...campaignOverrides,
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
      bundleId: null,
      phase: 'execution',
      ...(segmentOverrides ?? {}),
    },
    content: {
      insertLink: false,
      link: '',
      text: '',
      scheduleAt: undefined,
      shortLinkDomain: null,
      lineNumber: '',
      platformSettingsId: null,
      mediaUuid: null,
      ...(contentOverrides ?? {}),
    },
    budget: {
      totalBudget: 0,
      estimatedMessages: undefined,
      ...(budgetOverrides ?? {}),
    },
    payment: {
      paymentMethod: '',
      termsAccepted: false,
      ...(paymentOverrides ?? {}),
    },
  };
};

const persistCampaignCreationDraft = (draft: CampaignData) => {
  localStorage.setItem('campaign_creation_data', JSON.stringify(draft));
  localStorage.setItem('campaign_creation_step', '1');
  saveLevelSelection({
    campaignTitle: draft.segment.campaignTitle || '',
    level1s: draft.segment.level1 ? [draft.segment.level1] : [],
    level2s: draft.segment.level2s || [],
    level3s: draft.segment.level3s || [],
    targetAudienceExcelFileUuid:
      draft.segment.targetAudienceExcelFileUuid ?? null,
    metadata: {},
    tags: draft.segment.tags || [],
    count: draft.segment.capacity || 0,
    lastUpdated: new Date().toISOString(),
  });
};

export const prepareCampaignCreationDraft = (draft: CampaignData) => {
  clearLevelSelection();
  localStorage.removeItem('campaign_creation_data');
  localStorage.removeItem('campaign_creation_step');
  persistCampaignCreationDraft(draft);
};
