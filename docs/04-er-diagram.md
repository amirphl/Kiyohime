# Behavioral Event Schema — ER Diagram

```mermaid
erDiagram
    CAMPAIGN {
        string id PK
        string title
        string business_category
        string status
        datetime created_at
        datetime scheduled_at
    }

    SENDING_LINE {
        string id PK
        string channel
        string provider
        bool is_active
    }

    CAMPAIGN_MESSAGE {
        string id PK
        string campaign_id FK
        string sending_line_id FK
        string text
        string short_link
        datetime sent_at
    }

    UTM_LINK {
        string id PK
        string campaign_message_id FK
        string short_code
        string full_url
        string utm_source
        string utm_medium
        string utm_campaign
    }

    INTERACTION_EVENT {
        string id PK
        string utm_link_id FK
        string pseudonym_user_id FK
        string event_type
        datetime occurred_at
        string channel
    }

    PSEUDONYM_USER {
        string id PK
        string token
        string segment_id FK
        datetime first_seen
        datetime last_seen
    }

    BEHAVIORAL_SEGMENT {
        string id PK
        string cluster_label
        string business_category
        float silhouette_score
        datetime computed_at
    }

    BEHAVIORAL_TAG {
        string id PK
        string segment_id FK
        string tag_key
        string tag_value
        string use_case_description
    }

    CAMPAIGN ||--o{ CAMPAIGN_MESSAGE : "has"
    SENDING_LINE ||--o{ CAMPAIGN_MESSAGE : "uses"
    CAMPAIGN_MESSAGE ||--o{ UTM_LINK : "generates"
    UTM_LINK ||--o{ INTERACTION_EVENT : "tracks"
    PSEUDONYM_USER ||--o{ INTERACTION_EVENT : "performs"
    PSEUDONYM_USER }o--|| BEHAVIORAL_SEGMENT : "belongs to"
    BEHAVIORAL_SEGMENT ||--o{ BEHAVIORAL_TAG : "has"
```

---

## Event Types

| Event Type | Triggered By | Recorded Field |
|------------|-------------|----------------|
| `click` | User clicks short link | `occurred_at`, channel |
| `view` | Landing page view | `occurred_at` |
| `sign_up` | Form submission | `occurred_at` |
| `purchase` | Checkout completion | `occurred_at`, value |
| `cancel` | Subscription cancel | `occurred_at` |
| `no_interaction` | Timeout after send | inferred, `occurred_at` |
