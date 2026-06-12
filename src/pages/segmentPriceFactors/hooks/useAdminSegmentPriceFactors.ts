import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminSegmentPriceFactorItem } from '../../../types/admin';
import { adminSegmentPriceFactorsApi } from '../api';
import { SegmentPriceFactorTranslations } from '../translations';
import {
  isSegmentPriceFactorPlatform,
  SEGMENT_PRICE_FACTOR_PLATFORMS,
  SegmentPriceFactorPlatform,
} from '../utils';

interface UseAdminSegmentPriceFactorsOptions {
  copy: SegmentPriceFactorTranslations;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const useAdminSegmentPriceFactors = ({
  copy,
  onError,
  onSuccess,
}: UseAdminSegmentPriceFactorsOptions) => {
  const [level3Options, setLevel3Options] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [factors, setFactors] = useState<AdminSegmentPriceFactorItem[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(false);
  const [factorsError, setFactorsError] = useState<string | null>(null);

  const [platform, setPlatform] = useState<SegmentPriceFactorPlatform>('sms');
  const [level3, setLevel3] = useState('');
  const [priceFactor, setPriceFactor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mountedRef = useRef(false);
  const didInitRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);
  const level3RequestIdRef = useRef(0);
  const factorsRequestIdRef = useRef(0);
  const loadingOptionsPlatformRef = useRef<string | null>(null);
  const loadingFactorsPlatformRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  const loadLevel3Options = useCallback(
    async (platformValue: SegmentPriceFactorPlatform = platform) => {
      if (loadingOptionsPlatformRef.current === platformValue) return;

      loadingOptionsPlatformRef.current = platformValue;
      const requestId = level3RequestIdRef.current + 1;
      level3RequestIdRef.current = requestId;

      if (mountedRef.current) {
        setLoadingOptions(true);
        setOptionsError(null);
      }

      try {
        const response =
          await adminSegmentPriceFactorsApi.listLevel3Options(platformValue);

        if (!mountedRef.current || requestId !== level3RequestIdRef.current) {
          return;
        }

        if (!response.success) {
          const message = response.message || copy.errors.loadOptions;
          setOptionsError(message);
          setLevel3Options([]);
          onErrorRef.current(message);
          return;
        }

        setLevel3Options(response.data?.items || []);
      } catch (error) {
        if (!mountedRef.current || requestId !== level3RequestIdRef.current) {
          return;
        }

        const message =
          error instanceof Error && error.message
            ? error.message
            : copy.errors.loadOptions;
        setOptionsError(message);
        setLevel3Options([]);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === level3RequestIdRef.current) {
          setLoadingOptions(false);
        }
        if (loadingOptionsPlatformRef.current === platformValue) {
          loadingOptionsPlatformRef.current = null;
        }
      }
    },
    [copy.errors.loadOptions, platform]
  );

  const loadFactors = useCallback(
    async (platformValue: SegmentPriceFactorPlatform = platform) => {
      if (loadingFactorsPlatformRef.current === platformValue) return;

      loadingFactorsPlatformRef.current = platformValue;
      const requestId = factorsRequestIdRef.current + 1;
      factorsRequestIdRef.current = requestId;

      if (mountedRef.current) {
        setLoadingFactors(true);
        setFactorsError(null);
      }

      try {
        const response =
          await adminSegmentPriceFactorsApi.listSegmentPriceFactors(
            platformValue
          );

        if (!mountedRef.current || requestId !== factorsRequestIdRef.current) {
          return;
        }

        if (!response.success) {
          const message = response.message || copy.errors.loadFactors;
          setFactorsError(message);
          setFactors([]);
          onErrorRef.current(message);
          return;
        }

        setFactors(response.data?.items || []);
      } catch (error) {
        if (!mountedRef.current || requestId !== factorsRequestIdRef.current) {
          return;
        }

        const message =
          error instanceof Error && error.message
            ? error.message
            : copy.errors.loadFactors;
        setFactorsError(message);
        setFactors([]);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === factorsRequestIdRef.current) {
          setLoadingFactors(false);
        }
        if (loadingFactorsPlatformRef.current === platformValue) {
          loadingFactorsPlatformRef.current = null;
        }
      }
    },
    [copy.errors.loadFactors, platform]
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadLevel3Options('sms');
    loadFactors('sms');
  }, [loadFactors, loadLevel3Options]);

  const validate = useCallback((): string | null => {
    if (!SEGMENT_PRICE_FACTOR_PLATFORMS.includes(platform)) {
      return copy.errors.missingPlatform;
    }
    if (!level3) return copy.errors.missingLevel3;

    const parsedPriceFactor = Number(priceFactor);
    if (!Number.isFinite(parsedPriceFactor) || parsedPriceFactor <= 0) {
      return copy.errors.invalidPriceFactor;
    }

    return null;
  }, [
    copy.errors.invalidPriceFactor,
    copy.errors.missingLevel3,
    copy.errors.missingPlatform,
    level3,
    platform,
    priceFactor,
  ]);

  const submit = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      onErrorRef.current(validationError);
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const response =
        await adminSegmentPriceFactorsApi.createSegmentPriceFactor({
          platform,
          level3,
          price_factor: Number(priceFactor),
        });

      if (!response.success) {
        onErrorRef.current(response.message || copy.errors.createFailed);
        return;
      }

      onSuccessRef.current(copy.successSaved);
      if (mountedRef.current) {
        setPriceFactor('');
      }
      await loadFactors(platform);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : copy.errors.createFailed;
      onErrorRef.current(message);
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  }, [
    copy.errors.createFailed,
    copy.successSaved,
    level3,
    loadFactors,
    platform,
    priceFactor,
    submitting,
    validate,
  ]);

  const changePlatform = useCallback(
    (nextPlatform: string) => {
      if (!isSegmentPriceFactorPlatform(nextPlatform)) {
        onErrorRef.current(copy.errors.missingPlatform);
        return;
      }

      setPlatform(nextPlatform);
      setLevel3('');
      loadLevel3Options(nextPlatform);
      loadFactors(nextPlatform);
    },
    [copy.errors.missingPlatform, loadFactors, loadLevel3Options]
  );

  return {
    platform,
    level3,
    priceFactor,
    level3Options,
    loadingOptions,
    optionsError,
    factors,
    loadingFactors,
    factorsError,
    submitting,
    setLevel3,
    setPriceFactor,
    changePlatform,
    loadLevel3Options,
    loadFactors,
    submit,
  };
};
