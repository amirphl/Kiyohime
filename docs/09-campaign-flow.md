# Campaign Flow Designer

## Current Automation (If/Else — 1404)

```mermaid
flowchart TD
    A([Campaign Start]) --> B[Send Initial Message]
    B --> C{User Interacted?}
    C -- Yes / clicked --> D[Branch: Conversion Path]
    C -- No / timeout --> E[Wait N days]
    E --> F{Send Reminder?}
    F -- Yes --> G[Send Reminder Message]
    F -- No --> H([End — No response])
    G --> I{User Interacted?}
    I -- Yes --> D
    I -- No --> H
    D --> J([End — Converted])
```

---

## Planned Visual Flow Builder (1405)

```mermaid
flowchart TD
    A([Trigger: Segment Match]) --> B[Send Message — Channel A]
    B --> C{Event within 48h?}

    C -- click --> D[Tag: interested]
    C -- purchase --> E[Tag: converted]
    C -- no event --> F[Send Reminder — Channel B]

    D --> G{A/B Test}
    G -- version A --> H[Follow-up: deep-dive offer]
    G -- version B --> I[Follow-up: social proof]

    H & I --> J{Winner selected automatically}
    J --> K[Scale winning version]

    F --> L{2nd interaction?}
    L -- yes --> D
    L -- no --> M([End — unresponsive tag])

    E --> N([End — success])
    K --> N
```

---

## Flow Builder Constraints

| Constraint | Value |
|------------|-------|
| Max active flows | ≥ 1,000 |
| Flow change application time | < 1 second |
| Anti-collision rule | prevents overlapping campaigns on same audience |
| A/B winner selection | automatic, based on CTR/LTR results |

---

## A/B Test — Winner Selection Flow

```mermaid
flowchart TD
    A([A/B Test Started]) --> B[Split audience\n50 / 50 by default]
    B --> C[Send Version A\nto group A]
    B --> D[Send Version B\nto group B]

    C & D --> E[Collect results\nover observation window]

    E --> F{Minimum sample\nreached?}
    F -- No --> E
    F -- Yes --> G{Statistical\nsignificance?}

    G -- Not yet --> E
    G -- Yes --> H{Which version\nwon on CTR / LTR?}

    H -- Version A --> I[Scale Version A\nto full remaining audience]
    H -- Version B --> J[Scale Version B\nto full remaining audience]
    H -- No difference --> K[Keep Version A\ndefault tiebreaker]

    I & J & K --> L[Log result\nto campaign report]
    L --> M([Test Complete])
```

> The platform selects the winner automatically — no manual intervention required.
