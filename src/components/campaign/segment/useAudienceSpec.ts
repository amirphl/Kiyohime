import { useEffect, useRef, useState } from 'react';
import { AudienceSpec } from '../../../types/campaign';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

let audienceSpecCache: AudienceSpec | null = null;
let audienceSpecFetchInFlight: Promise<AudienceSpec> | null = null;

export const useAudienceSpec = () => {
    const { accessToken } = useAuth();
    const [spec, setSpec] = useState<AudienceSpec | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!accessToken) return;
        if (fetchedRef.current) return;

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

        if (audienceSpecCache) {
            apply(audienceSpecCache);
            return () => {
                canceled = true;
            };
        }

        if (audienceSpecFetchInFlight) {
            audienceSpecFetchInFlight
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

        audienceSpecFetchInFlight = (async () => {
            apiService.setAccessToken(accessToken);
            const res = await apiService.listAudienceSpec();
            const s = (res as any)?.data?.spec ?? (res as any)?.data?.data?.spec;
            if (!res.success || !s) {
                throw new Error(res.message || 'Failed to load audience spec');
            }
            return s as AudienceSpec;
        })();

        audienceSpecFetchInFlight
            .then(s => {
                audienceSpecCache = s;
                apply(s);
            })
            .catch((e: any) => {
                if (canceled) return;
                const msg = e?.message || 'Failed to load audience spec';
                setError(msg);
                setLoading(false);
            })
            .finally(() => {
                audienceSpecFetchInFlight = null;
            });

        return () => {
            canceled = true;
        };
    }, [accessToken]);

    return { spec, loading, error };
}; 