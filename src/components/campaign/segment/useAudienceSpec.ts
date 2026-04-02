import { useEffect, useRef, useState } from 'react';
import { AudienceSpec } from '../../../types/campaign';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const audienceSpecCache = new Map<string, AudienceSpec>();
const audienceSpecFetchInFlight = new Map<string, Promise<AudienceSpec>>();

export const useAudienceSpec = (platform: string = 'sms') => {
    const { accessToken } = useAuth();
    const [spec, setSpec] = useState<AudienceSpec | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        fetchedRef.current = false;
        setSpec(null);
    }, [platform]);

    useEffect(() => {
        if (!accessToken) return;
        if (fetchedRef.current) return;
        const cacheKey = platform || 'sms';

        let canceled = false;
        setLoading(true);
        setError(null);

        const apply = (s: AudienceSpec) => {
            if (canceled) return;
            setSpec(s);
            setError(null);
            fetchedRef.current = true;
            setLoading(false);
        };

        if (audienceSpecCache.has(cacheKey)) {
            apply(audienceSpecCache.get(cacheKey) as AudienceSpec);
            return () => {
                canceled = true;
            };
        }

        const inFlight = audienceSpecFetchInFlight.get(cacheKey);
        if (inFlight) {
            inFlight
                .then(s => apply(s))
                .catch(() => {
                    if (canceled) return;
                    const msg = 'Failed to load audience spec';
                    setError(msg);
                    setLoading(false);
                });
            return () => {
                canceled = true;
            };
        }

        const fetchPromise = (async () => {
            apiService.setAccessToken(accessToken);
            const res = await apiService.listAudienceSpec(cacheKey);
            const s = (res as any)?.data?.spec ?? (res as any)?.data?.data?.spec;
            if (!res.success || !s) {
                throw new Error(res.message || 'Failed to load audience spec');
            }
            return s as AudienceSpec;
        })();
        audienceSpecFetchInFlight.set(cacheKey, fetchPromise);

        fetchPromise
            .then(s => {
                audienceSpecCache.set(cacheKey, s);
                apply(s);
            })
            .catch((e: any) => {
                if (canceled) return;
                const msg = e?.message || 'Failed to load audience spec';
                setError(msg);
                setLoading(false);
            })
            .finally(() => {
                audienceSpecFetchInFlight.delete(cacheKey);
            });

        return () => {
            canceled = true;
        };
    }, [accessToken, platform]);

    return { spec, loading, error };
}; 
