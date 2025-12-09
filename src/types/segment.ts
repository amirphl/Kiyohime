// Level Selection State
// This represents the complete selection state for the level component

export interface LevelMetadata {
    [key: string]: any;
}

export interface LevelSelectionState {
    // Campaign title
    campaignTitle: string;

    // Selected level 1 (currently single selection, but stored as array for future flexibility)
    level1s: string[];

    // Selected level 2s (multiple selection)
    level2s: string[];

    // Selected level 3s (multiple selection)
    level3s: string[];

    // Metadata from selected items
    metadata: Record<string, LevelMetadata>;

    // Union of all tags from selected level 3 items
    tags: string[];

    // Total count/capacity from selected level 3 items
    count: number;

    // Timestamp of last update
    lastUpdated: string;
}

export const createEmptyLevelSelection = (): LevelSelectionState => ({
    campaignTitle: '',
    level1s: [],
    level2s: [],
    level3s: [],
    metadata: {},
    tags: [],
    count: 0,
    lastUpdated: new Date().toISOString(),
});

// LocalStorage key for level selection
export const LEVEL_SELECTION_KEY = 'campaign_level_selection';

// Helper functions for localStorage operations
export const saveLevelSelection = (selection: LevelSelectionState): void => {
    try {
        selection.lastUpdated = new Date().toISOString();
        localStorage.setItem(LEVEL_SELECTION_KEY, JSON.stringify(selection));

        // Dispatch custom event for same-tab reactivity
        window.dispatchEvent(new Event('levelSelectionUpdated'));
    } catch (error) {
        console.error('❌ [LevelSelection] Failed to save:', error);
    }
};

export const loadLevelSelection = (): LevelSelectionState | null => {
    try {
        const stored = localStorage.getItem(LEVEL_SELECTION_KEY);
        if (stored) {
            const selection = JSON.parse(stored) as LevelSelectionState;
            return selection;
        }
    } catch (error) {
        console.error('❌ [LevelSelection] Failed to load:', error);
    }
    return null;
};

export const clearLevelSelection = (): void => {
    try {
        localStorage.removeItem(LEVEL_SELECTION_KEY);
    } catch (error) {
        console.error('❌ [LevelSelection] Failed to clear:', error);
    }
}; 