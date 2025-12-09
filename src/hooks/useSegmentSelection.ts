import { useState, useEffect } from 'react';
import {
    LevelSelectionState,
    loadLevelSelection,
    createEmptyLevelSelection,
    LEVEL_SELECTION_KEY
} from '../types/segment';

/**
 * Custom hook to access the current level selection state from localStorage
 * This provides a reactive way to read the level selection data
 */
export const useLevelSelection = () => {
    const [selection, setSelection] = useState<LevelSelectionState>(() => {
        return loadLevelSelection() || createEmptyLevelSelection();
    });

    useEffect(() => {
        // Listen for storage changes (e.g., from other tabs or components)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === LEVEL_SELECTION_KEY) {
                const newSelection = loadLevelSelection() || createEmptyLevelSelection();
                setSelection(newSelection);
            }
        };

        // Listen for custom event (for same-tab updates)
        const handleLevelUpdate = () => {
            const newSelection = loadLevelSelection() || createEmptyLevelSelection();
            setSelection(newSelection);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('levelSelectionUpdated', handleLevelUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('levelSelectionUpdated', handleLevelUpdate);
        };
    }, []);

    return {
        selection,
        // Convenience accessors
        campaignTitle: selection.campaignTitle,
        level1s: selection.level1s,
        level2s: selection.level2s,
        level3s: selection.level3s,
        metadata: selection.metadata,
        tags: selection.tags,
        count: selection.count,
        lastUpdated: selection.lastUpdated,
        // Checks
        hasSelections: selection.level1s.length > 0 && selection.level3s.length > 0,
        isEmpty: selection.level1s.length === 0 && selection.level2s.length === 0 && selection.level3s.length === 0,
    };
}; 