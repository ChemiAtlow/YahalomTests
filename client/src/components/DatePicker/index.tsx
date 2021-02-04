import { constants } from '@yahalom-tests/common';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormField } from '../Forms';
import type { DateArgs, DateDetails } from "./types";
import "./DatePicker.scoped.scss";
import DatePickerHead from './DatePickerHead';
import DatePickerBody from './DatePickerBody';
import { useClickOutside } from '../../hooks';
const { TIME } = constants;

interface DatePickerProps {
    initialDate?: Date;
    label: string;
    onChange: (timestamp: number) => void;
}


const DatePicker: React.FC<DatePickerProps> = ({ label, onChange, initialDate }) => {
    const [inputVal, setInputVal] = useState("");
    const todayTimestamp = useMemo(() => Date.now() - (Date.now() % TIME.day) + new Date().getTimezoneOffset() * 1000 * 60, [])
    const [monthDetails, setMonthDetails] = useState<DateDetails[]>();
    const [selectedDay, setSelectedDay] = useState(todayTimestamp);
    const [yearState, setYearState] = useState(0);
    const [monthState, setMonthState] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useClickOutside<HTMLDivElement>({ activate: showDatePicker, callback: () => setShowDatePicker(false) });

    const getNumberOfDays = useCallback((year: number, month: number) => {
        return 40 - new Date(year, month, 40).getDate();
    }, []);
    const getDayDetails = useCallback((args: DateArgs) => {
        const _date = args.dayOfMonth - args.firstDayOfMonth;
        const dayOfWeek = args.dayOfMonth % 7;
        let prevMonth = args.month - 1;
        let prevYear = args.year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        const date = (_date < 0 ? prevMonthNumberOfDays + _date : _date % args.numberOfDaysInMonth) + 1;
        const month = _date < 0 ? -1 : _date >= args.numberOfDaysInMonth ? 1 : 0;
        const timestamp = new Date(args.year, args.month, date).getTime();
        return {
            date,
            dayOfWeek,
            month,
            timestamp
        }
    }, [getNumberOfDays]);
    const getMonthDetails = useCallback<(year: number, month: number) => DateDetails[]>((year, month) => {
        const firstDayOfMonth = (new Date(year, month)).getDay(),
            numberOfDaysInMonth = getNumberOfDays(year, month),
            monthArray = [],
            rows = 6, cols = 7;
        let currentDay = null;
        let dayOfMonth = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                currentDay = getDayDetails({
                    dayOfMonth,
                    numberOfDaysInMonth,
                    firstDayOfMonth,
                    year,
                    month
                });
                monthArray.push(currentDay);
                dayOfMonth++;
            }
        }
        return monthArray;
    }, [getNumberOfDays, getDayDetails]);
    const getDateFromDateString = useCallback((dateValue: string) => {
        let dateData = dateValue.split('/').map(d => parseInt(d, 10));
        if (dateData.length < 3)
            return null;
        const [year, month, date] = dateData;
        return { year, month, date };
    }, []);
    const getMonthStr = useCallback((month: number) => TIME.monthNames[Math.max(Math.min(11, month), 0)] || 'Month', []);
    const getDateStringFromTimestamp = useCallback((timestamp: number) => {
        const dateObject = new Date(timestamp);
        const month = dateObject.getMonth() + 1;
        const date = dateObject.getDate();
        return `${date.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${dateObject.getFullYear()}`;
    }, []);
    const updateDateFromInput = useCallback((newVal: string) => {
        setInputVal(newVal);
        const dateData = getDateFromDateString(newVal);
        if (dateData !== null) {
            const { year, month, date } = dateData;
            setSelectedDay(new Date(year, month - 1, date).getTime());
            setYearState(year);
            setMonthState(month - 1);
            setMonthDetails(getMonthDetails(year, month - 1));
        }
    }, [setInputVal, setYearState, setMonthState, setMonthDetails, getDateFromDateString, getMonthDetails]);
    const changeYear = useCallback((offset: number) => {
        const year = yearState + offset;
        setYearState(year);
        setMonthDetails(getMonthDetails(year, monthState));
    }, [yearState, monthState, setYearState, setMonthDetails, getMonthDetails]);
    const changeMonth = useCallback((offset: number) => {
        let year = yearState;
        let month = monthState + offset;
        if (month === -1) {
            month = 11;
            year--;
        } else if (month === 12) {
            month = 0;
            year++;
        }
        setYearState(year);
        setMonthState(month);
        setMonthDetails(getMonthDetails(year, month));
    }, [yearState, monthState, setYearState, setMonthState, setMonthDetails, getMonthDetails]);

    useEffect(() => {
        
        const date = initialDate || new Date();
        const year = date.getFullYear(), month = date.getMonth();
        setSelectedDay(date.setHours(0, 0, 0, 0))        
        setMonthState(month);
        setYearState(year);
        setMonthDetails(getMonthDetails(year, month));
    }, [initialDate, setMonthState, setYearState, setMonthDetails, getMonthDetails, setInputVal, getDateStringFromTimestamp]);
    useEffect(() => {
        const dateString = getDateStringFromTimestamp(selectedDay);
        setInputVal(dateString);
        onChange(selectedDay);
    }, [selectedDay, setInputVal, getDateStringFromTimestamp, onChange]);

    return (
        <div className="date-picker__wrapper" ref={datePickerRef}>
            <div className="date-picker__input" onClick={() => setShowDatePicker(true)}>
                <FormField label={label} blockErrors type="text" value={inputVal} onChange={e => updateDateFromInput(e.target.value)} />
            </div>
            {showDatePicker && <div className="date-picker__container">
                <DatePickerHead currentMonth={getMonthStr(monthState)} currentYear={yearState} onChangeMonth={changeMonth} onChangeYear={changeYear} />
                <DatePickerBody monthDetails={monthDetails} today={todayTimestamp} selectedDay={selectedDay} onDateClick={setSelectedDay} />
            </div>}
        </div>
    );
};

export default DatePicker;