# System Architecture

## Component Overview

```mermaid
graph TB
    subgraph Clients["Client Layer"]
        A[Brand / User Browser]
        B[Agency Browser]
        C[Admin Browser]
    end

    subgraph Panel["Customer Panel (Frontend)"]
        D[OTP Login]
        E[Campaign Builder]
        F[Advanced Reporting]
        G[Wallet & Billing]
        H[Support / Tickets]
    end

    subgraph BackOffice["Back-Office Panel (Frontend)"]
        I[Customer Mgmt]
        J[Sending Approval]
        K[Pricing & Payment]
        L[Management Reports]
    end

    subgraph API["API Gateway / Backend"]
        M[Auth Service]
        N[Campaign Service]
        O[Reporting Service]
        P[Financial Service]
        Q[Notification Service]
    end

    subgraph Shared["Shared Components"]
        R[Link Shortener & UTM Tracker]
        S[If/Else Automation Engine]
        T[Flow Builder ⟶ 1405]
    end

    subgraph AI["AI / Data Layer"]
        U[Event Ingestion Pipeline]
        V[Feature Engineering]
        W[Clustering Engine K-Means/DBSCAN]
        X[Prediction Models CTR/LTR]
        Y[Recommender Engine]
        Z[Behavioral Tag Store]
    end

    subgraph Channels["Channel Layer"]
        AA[SMS Gateway]
        AB[Messenger A]
        AC[Messenger B ⟶ 1405]
    end

    subgraph Storage["Storage"]
        DB1[(Relational DB)]
        DB2[(Event Store)]
        DB3[(Model Registry)]
    end

    A & B --> Panel
    C --> BackOffice
    Panel & BackOffice --> API
    API --> Shared
    API --> AI
    API --> Channels
    API --> Storage
    AI --> Storage
    R --> DB2
```

---

## Deployment Topology

```mermaid
graph LR
    subgraph Edge
        LB[Load Balancer]
    end

    subgraph AppTier["Application Tier"]
        S1[Panel Server]
        S2[Back-Office Server]
        S3[API Server]
        S4[Worker / Queue Consumer]
    end

    subgraph DataTier["Data Tier"]
        DB[(Primary DB)]
        Cache[(Redis Cache)]
        Queue[(Message Queue)]
        Blob[(Object Storage)]
    end

    subgraph AITier["AI Tier"]
        ML1[Training Jobs - Batch]
        ML2[Inference API]
        ML3[Model Registry]
    end

    LB --> S1 & S2 & S3
    S3 --> Queue
    Queue --> S4
    S3 & S4 --> DB & Cache
    S4 --> Blob
    S3 --> ML2
    ML1 --> ML3
    ML2 --> ML3
```

---

## Ops Runbook — Overview

### Monitoring Checks

| Signal | Alert Threshold | Action |
|--------|----------------|--------|
| API response time | > 2 s p95 | Page on-call; check queue backlog |
| Platform availability | < 99% over 5 min | Escalate; check LB and app tier |
| Model drift detected | Any | Trigger safe model update job |
| Event pipeline lag | > 15 min | Check stream processor; restart if stalled |
| Error rate | > 1% over 10 min | Inspect logs; roll back last deploy if correlated |

### Backup Schedule

```mermaid
graph LR
    DB[(Primary DB)] -->|daily snapshot| S3[Object Storage\nretention 30 days]
    EventStore[(Event Store)] -->|daily export| S3
    ModelReg[(Model Registry)] -->|on every model update| S3
    S3 -->|weekly restore drill| TestEnv[Test Environment]
```

### Incident Response Steps

```mermaid
flowchart TD
    A[Alert fires] --> B{Severity?}
    B -- P1 critical --> C[Page on-call + lead\nwithin 5 min]
    B -- P2 degraded --> D[Notify on-call\nwithin 15 min]
    C & D --> E[Diagnose: logs · metrics · recent deploys]
    E --> F{Root cause found?}
    F -- Yes --> G[Apply fix or rollback]
    F -- No --> H[Escalate to tech lead]
    G & H --> I[Verify resolution]
    I --> J[Write incident report\nwithin 24 h]
```
