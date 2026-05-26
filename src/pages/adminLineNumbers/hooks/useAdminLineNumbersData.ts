import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLineNumberReportItem } from '../../../types/admin';
import { adminLineNumbersApi } from '../api';
import { AdminManagedLineNumber } from '../types';
import {
  buildReorderPayload,
  mapRequestError,
  moveItem,
  sortLineNumbersByPriority,
} from '../utils';
import { AdminLineNumbersCopy } from '../translations';

interface UseAdminLineNumbersDataOptions {
  copy: AdminLineNumbersCopy;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const useAdminLineNumbersData = ({
  copy,
  onError,
  onSuccess,
}: UseAdminLineNumbersDataOptions) => {
  const isMountedRef = useRef(true);
  const didInitRef = useRef(false);

  const [lineNumbers, setLineNumbers] = useState<AdminManagedLineNumber[]>([]);
  const [lineNumbersLoading, setLineNumbersLoading] = useState(false);
  const [lineNumbersError, setLineNumbersError] = useState<string | null>(null);

  const [report, setReport] = useState<AdminLineNumberReportItem[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadLineNumbers = useCallback(
    async (notify = false) => {
      if (isMountedRef.current) {
        setLineNumbersLoading(true);
        setLineNumbersError(null);
      }

      const response = await adminLineNumbersApi.list();
      if (!isMountedRef.current) {
        return;
      }

      if (!response.success) {
        const message = mapRequestError(
          response.error?.code,
          response.message || copy.errors.loadListFailed,
          copy
        );
        setLineNumbers([]);
        setLineNumbersError(message);
        if (notify) {
          onError(message);
        }
        setLineNumbersLoading(false);
        return;
      }

      setLineNumbers(sortLineNumbersByPriority(response.data || []));
      setHasOrderChanges(false);
      setLineNumbersError(null);
      setLineNumbersLoading(false);
    },
    [copy, onError]
  );

  const loadReport = useCallback(
    async (notify = false) => {
      if (isMountedRef.current) {
        setReportLoading(true);
        setReportError(null);
      }

      const response = await adminLineNumbersApi.report();
      if (!isMountedRef.current) {
        return;
      }

      if (!response.success) {
        const message = mapRequestError(
          response.error?.code,
          response.message || copy.errors.loadReportFailed,
          copy
        );
        setReport([]);
        setReportError(message);
        if (notify) {
          onError(message);
        }
        setReportLoading(false);
        return;
      }

      setReport(response.data || []);
      setReportError(null);
      setReportLoading(false);
    },
    [copy, onError]
  );

  const refreshAll = useCallback(
    async (notify = false) => {
      await Promise.all([loadLineNumbers(notify), loadReport(notify)]);
    },
    [loadLineNumbers, loadReport]
  );

  useEffect(() => {
    if (didInitRef.current) {
      return;
    }

    didInitRef.current = true;
    void refreshAll(false);
  }, [refreshAll]);

  const reorderLineNumber = useCallback((fromIndex: number, toIndex: number) => {
    setLineNumbers(currentItems => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentItems.length ||
        toIndex >= currentItems.length ||
        fromIndex === toIndex
      ) {
        return currentItems;
      }

      setHasOrderChanges(true);
      return moveItem(currentItems, fromIndex, toIndex);
    });
  }, []);

  const saveOrder = useCallback(async () => {
    setSavingOrder(true);

    const response = await adminLineNumbersApi.reorder(
      buildReorderPayload(lineNumbers)
    );

    if (!isMountedRef.current) {
      return;
    }

    if (!response.success) {
      const message = mapRequestError(
        response.error?.code,
        response.message || copy.errors.reorderFailed,
        copy
      );
      setSavingOrder(false);
      onError(message);
      return;
    }

    const normalizedItems = lineNumbers.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setLineNumbers(normalizedItems);
    setHasOrderChanges(false);
    setSavingOrder(false);
    onSuccess(copy.success.orderSaved);
  }, [copy, lineNumbers, onError, onSuccess]);

  return {
    lineNumbers,
    lineNumbersLoading,
    lineNumbersError,
    report,
    reportLoading,
    reportError,
    hasOrderChanges,
    savingOrder,
    reloadLineNumbers: loadLineNumbers,
    reloadReport: loadReport,
    refreshAll,
    reorderLineNumber,
    saveOrder,
  };
};

