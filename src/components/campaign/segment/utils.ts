import { AudienceSpec, AudienceSpecItem } from '../../../types/campaign';

export const formatLabel = (s: string) => {
    return s.replace(/_/g, ' ');
};

export const getLevel1Options = (spec: AudienceSpec | null) => {
    if (!spec) return [] as Array<{ value: string; label: string }>;
    return Object.keys(spec).map(key => ({ value: key, label: formatLabel(key) }));
};

export const getLevel2Options = (spec: AudienceSpec | null, level1: string) => {
    if (!spec || !level1 || !(spec as any)[level1]) return [] as Array<{ value: string; label: string }>;
    return Object.keys((spec as any)[level1]).map(l2 => ({ value: l2, label: formatLabel(l2) }));
};

export const getLevel3Options = (spec: AudienceSpec | null, level1: string, level2: string) => {
    if (!spec || !level1 || !level2) return [] as Array<{ value: string; label: string }>;
    const bucket = (spec as any)[level1]?.[level2]?.items || {};
    return Object.keys(bucket).map(l3 => ({ value: l3, label: formatLabel(l3) }));
};

export const getLevel2Metadata = (spec: AudienceSpec | null, level1: string, level2: string): Record<string, any> | null => {
    if (!spec || !level1 || !level2) return null;
    const meta = (spec as any)[level1]?.[level2]?.metadata;
    if (!meta || typeof meta !== 'object') return null;
    return meta as Record<string, any>;
};

export const getItemTags = (spec: AudienceSpec | null, level1: string, level2: string, level3: string): string[] => {
    if (!spec || !level1 || !level2 || !level3) return [];
    const item = (spec as any)[level1]?.[level2]?.items?.[level3] as AudienceSpecItem | undefined;
    return Array.from(new Set<string>((item?.tags || []) as string[]));
};