# Data Flow

## End-to-End: Event Capture → Model Output → Campaign

```mermaid
flowchart TD
    A([User Receives Campaign Message]) --> B{Clicks UTM Link?}
    B -- Yes --> C[Link Shortener / UTM Tracker]
    B -- No --> D[Non-interaction recorded as timeout]

    C --> E[Interaction Event Logged\nclick / view / sign-up / purchase / cancel]
    D --> E

    E --> F[Event Store\nraw anonymous events]

    F --> G{Pipeline Mode}
    G -- Real-Time --> H[Stream Processor\nalerts in < 15 min]
    G -- Periodic Batch --> I[Batch ETL Job\ndaily / weekly]

    H & I --> J[Feature Engineering\nRecency · Frequency · Value\ntime pref · channel pref\nresponse-to-repetition]

    J --> K[Behavioral Clustering\nK-Means / DBSCAN]
    K --> L[Cluster → Tag Mapping\n1,000+ behavioral tags]

    L --> M[Segment Store\nanonymized profiles]

    M --> N[Prediction Models\nCTR / LTR per segment]
    N --> O[Recommender Engine\nmessage · timing · channel]

    O --> P[Campaign Service\naudience · message · schedule]
    P --> Q[Sending Queue]
    Q --> R{Channel Router}
    R --> S[SMS Gateway]
    R --> T[Messenger A]
    R --> U[Messenger B ⟶ 1405]

    S & T & U --> V[Delivery Confirmation]
    V --> E
```

---

## Data Lineage Summary

| Stage | Input | Output | Quality Gate |
|-------|-------|--------|--------------|
| Event capture | User click on UTM link | Raw event record | Schema validation |
| ETL / cleaning | Raw events | Standardized events | Field coverage ≥ 90%, error ≤ 2% |
| Feature engineering | Cleaned events | Feature vectors | Completeness check |
| Clustering | Feature vectors | Cluster labels | Silhouette ≥ 0.45 |
| Tag mapping | Cluster labels | Behavioral tags | Coverage ≥ 60% |
| Prediction | Tagged profiles | CTR/LTR scores | AUC ≥ 0.75 |
| Recommendation | Scores + context | Message/time/channel | Response < 4 s (MVP) |
