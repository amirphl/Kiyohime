# Jazebeh Guide Chatbot — Campaign-Building Assistant

> Planned for 1405

## Conversation Flow

```mermaid
flowchart TD
    A([User opens Chatbot]) --> B[Chatbot greets user\nand asks for brand/product brief]
    B --> C[User describes:\nbrand · objective · budget · constraints]
    C --> D[Chatbot extracts intent\nvia NLP]

    D --> E[Look up matching\nbehavioral tags & segments]
    E --> F[Generate recommendations]

    F --> G{User reviews}
    G -- accepts --> H[Export to Flow Builder\neditable campaign draft]
    G -- edits --> I[User modifies\nmessage / channel / timing]
    I --> F

    H --> J[Campaign goes to\nnormal approval & sending flow]
    J --> K([Done])
```

---

## Recommendation Output per Conversation

| Output | Description |
|--------|-------------|
| Message drafts | Multiple tones (formal / casual / promotional) |
| Channel suggestion | SMS / Messenger A / B, based on segment preference |
| Timing suggestion | Best send time from behavioral data |
| Behavioral tags | Matching audience tags from v1/v2 list |
| Campaign path | If/Else or multi-branch flow, ready to import |

---

## Compliance & Privacy Rules

```mermaid
flowchart LR
    A[User Input] --> B{Contains\npersonal data?}
    B -- Yes --> C[Reject / redact\nask user to rephrase]
    B -- No --> D[Process normally]

    D --> E{Recommendation\nviolates channel rules?}
    E -- Yes --> F[Block suggestion\nshow policy reason]
    E -- No --> G[Return recommendation]

    G --> H[Log to Audit Report\nconversation ID · timestamp · action]
```

---

## Integration with Platform

```mermaid
sequenceDiagram
    participant U as User
    participant CB as Chatbot
    participant AI as AI Recommender
    participant FB as Flow Builder

    U->>CB: describe campaign brief
    CB->>AI: request segment + message options
    AI-->>CB: tags, message drafts, timing, channel
    CB-->>U: show recommendations
    U->>CB: accept / modify
    CB->>FB: transfer conversation output as editable flow
    FB-->>U: open flow for review & launch
```
