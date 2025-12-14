import React from 'react';
import { Calendar } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

interface ScheduleCardProps {
    showDateTimePicker: boolean;
    scheduleAt?: string;
    isEnglish: boolean;
    onToggle: () => void;
    onScheduleChange: (scheduleAt?: string) => void;
    title: string;
    disableLabel: string;
    enableLabel: string;
    scheduledLabel: string;
    immediateLabel: string;
    dateTimeLabel: string;
    tooSoonError: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    showDateTimePicker,
    scheduleAt,
    isEnglish,
    onToggle,
    onScheduleChange,
    title,
    disableLabel,
    enableLabel,
    scheduledLabel,
    immediateLabel,
    dateTimeLabel,
    tooSoonError,
}) => {
    const nowMs = Date.now();
    const minMs = nowMs + 20 * 60 * 1000;
    const schedMs = scheduleAt ? new Date(scheduleAt).getTime() : NaN;
    const isInvalid = scheduleAt ? (Number.isNaN(schedMs) || schedMs < minMs) : false;

    return (
        <Card className="h-full">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                    {title}
                </h3>
                <div className="flex items-center space-x-3">
                    <Button
                        variant={showDateTimePicker ? 'primary' : 'outline'}
                        onClick={onToggle}
                        size="sm"
                    >
                        {showDateTimePicker ? disableLabel : enableLabel}
                    </Button>
                    <span className="text-sm text-gray-600">
                        {showDateTimePicker ? scheduledLabel : immediateLabel}
                    </span>
                </div>
                {showDateTimePicker && (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="scheduleAt" className="block text-sm font-medium text-gray-700">
                                {dateTimeLabel}
                            </label>
                            <DatePicker
                                calendar={isEnglish ? gregorian : persian}
                                locale={isEnglish ? gregorian_en : persian_fa}
                                plugins={[<TimePicker hideSeconds={false} />]}
                                value={scheduleAt ? new Date(scheduleAt) : undefined}
                                onChange={(val: any) => {
                                    if (!val) {
                                        onScheduleChange(undefined);
                                        return;
                                    }
                                    try {
                                        const jsDate = val.toDate ? val.toDate() : new Date(val);
                                        onScheduleChange(jsDate.toISOString());
                                    } catch {
                                        onScheduleChange(undefined);
                                    }
                                }}
                                format="YYYY/MM/DD HH:mm:ss"
                                className="w-full mt-1"
                            />
                            {isInvalid && (
                                <p className="text-sm text-red-600 mt-2">{tooSoonError}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ScheduleCard; 