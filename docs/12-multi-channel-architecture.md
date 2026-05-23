# Multi-Channel Architecture

## Channel Routing & Fallback

```mermaid
flowchart TD
    A[Campaign Sending Queue] --> B[Channel Router]

    B --> C{Primary Channel\nAvailable?}

    C -- Yes --> D{Select Channel}
    D --> E[SMS Gateway]
    D --> F[Messenger A]
    D --> G[Messenger B — 1405]

    C -- No / disruption --> H[Fallback Router]
    H --> I{Fallback Channel\nAvailable?}
    I -- Yes --> J[Route to Fallback\n< 3 seconds]
    I -- No --> K[Queue & Retry]

    E & F & G & J --> L[Delivery Confirmation]
    L --> M{Delivered?}
    M -- Yes --> N([Success])
    M -- No --> K
    K --> B
```

---

## Queue & Rate Management

```mermaid
graph TD
    subgraph Queue["Sending Queue"]
        Q1[Priority Queue\nhigh-value segments]
        Q2[Standard Queue\nbatch sends]
        Q3[Retry Queue\nfailed / timed-out]
    end

    subgraph Workers["Queue Workers"]
        W1[Worker Pool\nscalable]
    end

    subgraph Channels["Channels"]
        CH1[SMS — rate limited by provider]
        CH2[Messenger A — rate limited by provider]
        CH3[Messenger B — 1405]
    end

    Q1 & Q2 & Q3 --> W1
    W1 --> CH1 & CH2 & CH3
```

---

## Channel Capabilities

| Capability | SMS | Messenger A | Messenger B (1405) |
|------------|-----|-------------|-------------------|
| Text message | Yes | Yes | Yes |
| Rich media | No | Yes | Yes |
| Read receipts | No | Yes | Yes |
| Delivery confirmation | Yes | Yes | Yes |
| Rate-limit management | Yes | Yes | Yes |
| Automatic fallback | Yes | Yes | Yes |
| Route-switch time | < 3 s | < 3 s | < 3 s |
