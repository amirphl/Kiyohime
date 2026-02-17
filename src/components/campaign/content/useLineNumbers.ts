import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';

// Module-level cache and flags to avoid duplicate fetches
type LineNumberOption = { value: string; label: string; priceFactor?: number };

let activeLineNumbersCache: Array<LineNumberOption> | null = null;
let activeLineNumbersFetchInFlight: Promise<Array<LineNumberOption>> | null = null;
let fetchAttempted = false; // Track if we've already tried fetching (success or failure)

export const useLineNumbers = (accessToken: string | null) => {
    const [lineNumberOptions, setLineNumberOptions] = useState<Array<LineNumberOption>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (!accessToken) return;

        // Ensure API client has the latest token before fetching (avoids rare race where Authorization is missing)
        apiService.setAccessToken(accessToken);

        // Use cached data if available
        if (activeLineNumbersCache) {
            setLineNumberOptions(activeLineNumbersCache);
            return;
        }

        // If we already attempted and failed, don't retry automatically
        if (fetchAttempted && !activeLineNumbersFetchInFlight) {
            setError('Failed to load line numbers');
            return;
        }

        // Wait for in-flight request if one exists
        if (activeLineNumbersFetchInFlight) {
            setIsLoading(true);
            setError(null);
            activeLineNumbersFetchInFlight
                .then(opts => {
                    setLineNumberOptions(opts);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError('Failed to load line numbers');
                    setIsLoading(false);
                });
            return;
        }

        // Start new fetch (only if not attempted before)
        if (fetchAttempted) return;

        fetchAttempted = true; // Mark as attempted before starting
        setIsLoading(true);
        setError(null);
        activeLineNumbersFetchInFlight = (async () => {
            const res = await apiService.listActiveLineNumbers();
            if (!res.success || !res.data) {
                throw new Error(res.message || 'Failed to load line numbers');
            }
            const items = (res.data.items || []) as Array<{ line_number: string; price_factor?: number }>;
            const opts = items.map(it => ({
                value: it.line_number,
                label: it.line_number,
                priceFactor: typeof it.price_factor === 'number' ? it.price_factor : undefined,
            }));
            return opts;
        })();

        activeLineNumbersFetchInFlight
            .then(opts => {
                activeLineNumbersCache = opts;
                setLineNumberOptions(opts);
            })
            .catch(() => {
                setError('Failed to load line numbers');
                showToast('error', 'Failed to load line numbers');
            })
            .finally(() => {
                setIsLoading(false);
                activeLineNumbersFetchInFlight = null;
            });
    }, [accessToken, showToast]);

    return { lineNumberOptions, isLoading, error };
};
