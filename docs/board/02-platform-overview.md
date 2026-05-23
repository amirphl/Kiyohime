# Platform Overview

## What Jazebeh Does

```mermaid
graph TB
    subgraph Users["Who Uses It"]
        U1[Marketing Agencies]
        U2[Brands & Companies]
        U3[Platform Admins]
    end

    subgraph Jazebeh["Jazebeh Platform"]
        P1[Campaign Builder\ncreate · target · schedule]
        P2[Behavioral AI\nsegments · recommendations]
        P3[Reporting\nCTR · cost · conversions]
        P4[Wallet & Billing\nreserve · charge · refund]
        P5[Support\nFAQ · tickets]
    end

    subgraph Channels["Where Messages Go"]
        C1[SMS]
        C2[Messenger A]
        C3[Messenger B\n↑ 1405]
    end

    subgraph Audience["Audience"]
        A1[Behavioral Segments\nanonymous · 1,000+ tags]
    end

    U1 & U2 --> Jazebeh
    U3 --> Jazebeh
    Jazebeh --> Channels
    Jazebeh --> Audience
    Audience --> P1
```

---

## Two Panels, One Ecosystem

```mermaid
graph LR
    subgraph Agency["Agency / Brand Panel"]
        direction TB
        A1[Plan campaign]
        A2[Pick audience segment]
        A3[Write / get recommended message]
        A4[Set budget & schedule]
        A5[Track results]
    end

    subgraph Admin["Admin Back-Office"]
        direction TB
        B1[Approve campaigns]
        B2[Manage customers & pricing]
        B3[Monitor sending lines]
        B4[View platform-wide reports]
    end

    Agency -- submit for approval --> Admin
    Admin -- approved, live --> Agency
```

---

## Shared Intelligence Layer

```mermaid
graph TD
    Live[Every campaign that runs] --> Learn[Feeds behavioral data]
    Learn --> Smarter[Smarter segments & recommendations]
    Smarter --> Better[Better results for next campaign]
    Better --> Live
```

> The more campaigns run on Jazebeh, the more accurate the AI becomes for all users.
