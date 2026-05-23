# Platform Module Map

## Module Overview

```mermaid
graph TD
    subgraph CP["Customer Panel"]
        CP1[OTP Registration / Login]
        CP2[Campaign Builder\nbasic targeted sending]
        CP3[Advanced Reporting\nsend · delivery · clicks · CTR · cost]
        CP4[Wallet & Billing\nreservation · deduction · refund · invoice]
        CP5[Support\nFAQ · tickets · SLA]
        CP6[Sub-Account Reporting\nfor agencies]
        CP7[Discount Management\ncoupons · special plans]
    end

    subgraph BO["Back-Office Panel"]
        BO1[Customer & Agency Management]
        BO2[Sending Line Management]
        BO3[Campaign Result Storage\nanonymous / pseudonymous events]
        BO4[Management Reports\ncustomer / campaign view]
        BO5[Financial & Pricing\ndynamic pricing]
        BO6[Payment Management]
        BO7[Sending Supervision & Approval]
        BO8[Support Management\nSLA · ticket monitoring]
    end

    subgraph SC["Shared Components"]
        SC1[Link Shortener]
        SC2[UTM Tracker\nclick · interaction registration]
        SC3[If/Else Automation\nreminders · basic branches]
        SC4[Flow Builder\nvisual — 1405]
        SC5[A/B Test Engine\n1405]
        SC6[Recommender API\n1405]
    end

    CP2 --> SC1 & SC2 & SC3
    CP2 --> SC4
    BO7 --> CP2
```

---

## Module Status Table

| Module | Panel | Status |
|--------|-------|--------|
| OTP Registration / Login | Customer | Live |
| Campaign Builder (basic) | Customer | Live |
| Advanced Reporting | Customer | Live |
| Wallet & Billing | Customer | Live |
| Support / Tickets | Customer | Live |
| Sub-Account Reporting | Customer | Live |
| Discount Management | Customer | Live |
| Customer & Agency Management | Back-Office | Live |
| Sending Line Management | Back-Office | Live |
| Campaign Result Storage | Back-Office | Live |
| Management Reports | Back-Office | Live |
| Financial & Dynamic Pricing | Back-Office | Live |
| Payment Management | Back-Office | Live |
| Sending Approval | Back-Office | Live |
| Support SLA Monitor | Back-Office | Live |
| Link Shortener & UTM Tracker | Shared | Live |
| If/Else Automation | Shared | Live |
| Visual Flow Builder | Shared | 1405 |
| A/B Test Engine | Shared | 1405 |
| Recommender API | Shared | 1405 |

---

## External API Surface (1405)

```mermaid
graph LR
    subgraph External["External Systems\ncustomer CRM · website · app"]
        EX1[Customer System]
        EX2[Brand Website]
        EX3[Mobile App]
    end

    subgraph APIs["Jazebeh Public APIs"]
        A1[Campaign Event Webhook\nPOST /webhooks/events\npush interaction events in real time]
        A2[Segment Query API\nGET /segments\nfetch available audience segments]
        A3[Interaction Event API\nPOST /events\nsubmit clicks · views · purchases]
        A4[Report Export API\nGET /reports/campaigns\nexport campaign results as JSON/CSV]
        A5[Preference API\nPUT /users/preferences\nupdate opt-in · channel · timing]
    end

    subgraph SDK["Lightweight SDKs — if needed"]
        SDK1[Web JS library\ntrack events on brand site]
        SDK2[Mobile library\niOS / Android event tracking]
    end

    EX1 --> A2 & A4
    EX2 --> A3 & SDK1
    EX3 --> A3 & SDK2
    A1 --> EX1
```

| API | Direction | Purpose |
|-----|-----------|---------|
| Campaign Event Webhook | Outbound (Jazebeh → customer) | Notify customer system when campaign events occur |
| Segment Query API | Inbound (customer → Jazebeh) | Let customer systems read available segments |
| Interaction Event API | Inbound (customer → Jazebeh) | Submit conversion events from brand's own site/app |
| Report Export API | Inbound (customer → Jazebeh) | Download campaign performance data |
| Preference API | Inbound (customer → Jazebeh) | Sync user communication preferences |
