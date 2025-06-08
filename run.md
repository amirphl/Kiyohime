dev:
npm start # 8081
make run-dev-simple # 8080
docker compose -f docker-compose.dev.yml up -d # 8443



[eslint] 
src/components/campaign/CampaignBudgetStep.tsx
  Line 95:6:  React Hook useCallback has missing dependencies: 'campaignData.budget.lineNumber' and 'campaignData.budget.totalBudget'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

src/components/campaign/CampaignContentStep.tsx
  Line 123:9:  'handleScheduleAtChange' is assigned a value but never used  @typescript-eslint/no-unused-vars

src/components/campaign/CampaignPaymentStep.tsx
  Line 182:9:  'isFinishDisabled' is assigned a value but never used  @typescript-eslint/no-unused-vars

src/pages/DashboardPage.tsx
  Line 11:34:  'ListSMSCampaignsResponse' is defined but never used  @typescript-eslint/no-unused-vars

src/services/api.ts
  Line 5:3:  'CalculateCampaignCostRequest' is defined but never used  @typescript-eslint/no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

WARNING in [eslint] 
src/components/campaign/CampaignBudgetStep.tsx
  Line 95:6:  React Hook useCallback has missing dependencies: 'campaignData.budget.lineNumber' and 'campaignData.budget.totalBudget'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

src/components/campaign/CampaignContentStep.tsx
  Line 123:9:  'handleScheduleAtChange' is assigned a value but never used  @typescript-eslint/no-unused-vars

src/components/campaign/CampaignPaymentStep.tsx
  Line 182:9:  'isFinishDisabled' is assigned a value but never used  @typescript-eslint/no-unused-vars

src/pages/DashboardPage.tsx
  Line 11:34:  'ListSMSCampaignsResponse' is defined but never used  @typescript-eslint/no-unused-vars

src/services/api.ts
  Line 5:3:  'CalculateCampaignCostRequest' is defined but never used  @typescript-eslint/no-unused-vars

webpack compiled with 1 warning
No issues found.

--------------

make sure fiber crash can survive
apply sysctl to jaz server