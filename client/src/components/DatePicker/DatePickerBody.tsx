import React, { useCallback } from 'react';
import './DatePickerBody.scoped.scss';
import { DateDetails } from './types';

interface DatePickerBodyProps {
    monthDetails?: DateDetails[];
    today: number;
    selectedDay: number;
    onDateClick: (day: number) => void;
}

const DatePickerBody: React.FC<DatePickerBodyProps> = ({
    monthDetails,
    today,
    selectedDay,
    onDateClick,
}) => {
    const isCurrentDay = useCallback((timestamp: number) => timestamp === today, [today]);
    const isSelectedDay = useCallback((timestamp: number) => timestamp === selectedDay, [
        selectedDay,
    ]);

    return (
        <div className="calendar-container">
            <div className="calendar-container__head">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                    <div key={i} className="calendar-container__head-name">
                        {d}
                    </div>
                ))}
            </div>
            <div className="calendar-container__body">
                {monthDetails?.map(({month, date, timestamp}, index) => {
                    return (
                        <div
                            key={index}
                            className={`calendar-container__body-day ${
                                month !== 0 ? ' disabled' : ''
                            } ${isCurrentDay(timestamp) ? ' highlight' : ''} ${
                                isSelectedDay(timestamp) ? ' highlight-green' : ''
                            }`}>
                            <span onClick={() => onDateClick(timestamp)}>{date}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DatePickerBody;
