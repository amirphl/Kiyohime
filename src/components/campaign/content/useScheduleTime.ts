import { useState, useEffect } from 'react';

export const useScheduleTime = (scheduleAt?: string) => {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    // Initialize showDateTimePicker based on existing scheduleAt value
    useEffect(() => {
        if (scheduleAt) {
            setShowDateTimePicker(true);
        }
    }, [scheduleAt]);

    const toggleDateTimePicker = (onScheduleChange: (scheduleAt?: string) => void) => {
        const newShow = !showDateTimePicker;
        setShowDateTimePicker(newShow);

        if (newShow) {
            // Set default schedule to now + 20 minutes
            const now = new Date();
            const plus20 = new Date(now.getTime() + 20 * 60 * 1000);
            plus20.setSeconds(0, 0);
            onScheduleChange(plus20.toISOString());
        } else {
            // Clear schedule when disabling
            onScheduleChange(undefined);
        }
    };

    const setDateTimePicker = (show: boolean, onScheduleChange: (scheduleAt?: string) => void) => {
        setShowDateTimePicker(show);
        if (show) {
            const now = new Date();
            const plus20 = new Date(now.getTime() + 20 * 60 * 1000);
            plus20.setSeconds(0, 0);
            onScheduleChange(plus20.toISOString());
        } else {
            onScheduleChange(undefined);
        }
    };

    const validateScheduleTime = (scheduleAt?: string): boolean => {
        if (!scheduleAt) return true;

        const nowMs = Date.now();
        const minMs = nowMs + 20 * 60 * 1000;
        const schedMs = new Date(scheduleAt).getTime();

        return !Number.isNaN(schedMs) && schedMs >= minMs;
    };

    return {
        showDateTimePicker,
        toggleDateTimePicker,
        validateScheduleTime,
        setDateTimePicker,
    };
}; 