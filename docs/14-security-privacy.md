# Security & Privacy Architecture

## Overview

```mermaid
graph TD
    subgraph Boundary["System Boundary"]
        subgraph Auth["Authentication & Authorization"]
            A1[OTP Login\nno password stored]
            A2[Role-Based Access Control\nSuper Admin · Agency · Brand]
            A3[Session Management\nshort-lived tokens]
        end

        subgraph Privacy["Data Privacy"]
            B1[Identifier Tokenization\nno PII in analytics layer]
            B2[Pseudonym User IDs\nreplaced before storage]
            B3[Behavioral data only\nno personal profiles]
        end

        subgraph Pref["Preference Center — 1405"]
            C1[Opt-in / Opt-out]
            C2[Preferred Channel]
            C3[Preferred Timing]
            C4[Enforced automatically\nin sending path]
        end

        subgraph Audit["Audit & Compliance"]
            D1[Audit Log\nevery action stamped]
            D2[Chatbot conversation log]
            D3[Privacy Impact Assessment\nupdated per release]
        end
    end

    Auth --> Privacy
    Privacy --> Pref
    Auth & Privacy & Pref --> Audit
```

---

## Tokenization Flow

```mermaid
sequenceDiagram
    participant CH as Channel Provider
    participant GW as API Gateway
    participant TK as Tokenizer
    participant DB as Event Store

    CH->>GW: delivery event with phone/ID
    GW->>TK: tokenize identifier
    TK-->>GW: pseudonym token
    GW->>DB: store event with token only
    Note over DB: no raw PII ever written
```

---

## Role-Based Access Control Matrix

| Resource | Super Admin | Agency | Brand User |
|----------|-------------|--------|-----------|
| All customer data | Read/Write | None | None |
| Own brand campaigns | Read/Write | Read/Write | Read/Write |
| Sub-account campaigns | Read/Write | Read | None |
| Pricing & dynamic pricing | Read/Write | Read | None |
| Sending approval | Read/Write | None | None |
| Wallet & billing (own) | Read/Write | Read/Write | Read/Write |
| Audit logs | Read | None | None |
| Behavioral tag store | Read/Write | Read | Read |

---

## Privacy Targets

| Target | Value |
|--------|-------|
| Data leakage incidents in pilots | 0 |
| Audit log completeness | 100% |
| Preference enforcement | automatic, real-time |
| PII in analytics layer | 0 — tokenized identifiers only |
