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
    label: string;
    onChange: (timestamp: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, onChange }) => {
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
        const day = args.dayOfMonth % 7;
        let prevMonth = args.month - 1;
        let prevYear = args.year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        let date = (_date < 0 ? prevMonthNumberOfDays + _date : _date % args.numberOfDaysInMonth) + 1;
        let month = _date < 0 ? -1 : _date >= args.numberOfDaysInMonth ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date,
            day,
            month,
            timestamp,
            dayString: TIME.dayNames[day]
        }
    }, [getNumberOfDays]);
    const getMonthDetails = useCallback<(year: number, month: number) => DateDetails[]>((year, month) => {
        const monthDays = TIME.getMonthDays(month, year);
        const monthFirstDay = TIME.getMonthFirstDay(month, year);
        // Get number of days to be displayed from previous and next months
        // These ensure a total of 42 days (6 weeks) displayed on the calendar
        const daysFromPrevMonth = monthFirstDay - 1;
        const daysFromNextMonth = TIME.CALENDAR_WEEKS * TIME.DAYS_IN_WEEK - (daysFromPrevMonth + monthDays);
        // Get the previous and next months and years
        const { month: prevMonth, year: prevMonthYear } = TIME.getPreviousMonth(month, year);
        const { month: nextMonth, year: nextMonthYear } = TIME.getNextMonth(month, year);
        // Get number of days in previous month
        const prevMonthDays = TIME.getMonthDays(prevMonth, prevMonthYear);
        // Builds dates to be displayed from previous month
        const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
            const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
            getDayDetails({
                dayOfMonth,
                numberOfDaysInMonth,
                firstDayOfMonth,
                year,
                month
            });
            return [prevMonthYear, TIME.zeroPad(prevMonth, 2), TIME.zeroPad(day, 2)];
        });
        // Builds dates to be displayed from current month
        // const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
        //     const day = index + 1;
        //     return [year, zeroPad(month, 2), zeroPad(day, 2)];
        // });
        // // Builds dates to be displayed from next month
        // const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
        //     const day = index + 1;
        //     return [nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2)];
        // });
        // Combines all dates from previous, current and next months
        // return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
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
        return `${date < 10 ? '0' + date : date}/${month < 10 ? '0' + month : month}/${dateObject.getFullYear()}`;
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
        setYearState(yearState + offset);
        setMonthDetails(getMonthDetails(yearState, monthState));
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
        if (showDatePicker) {
            console.log("SET MONTH AND DATE")
        }
    }, [showDatePicker])
    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear(), month = date.getMonth();
        setMonthState(month);
        setYearState(year);
        setMonthDetails(getMonthDetails(year, month));
    }, [setMonthState, setYearState, setMonthDetails, getMonthDetails]);
    useEffect(() => {
        const dateString = getDateStringFromTimestamp(selectedDay);
        setInputVal(dateString);
        onChange(selectedDay);
    }, [selectedDay, setInputVal, getDateStringFromTimestamp, onChange]);

    return (
        <div className="date-picker__wrapper" ref={datePickerRef}>
            <div className="date-picker__input" onClick={() => setShowDatePicker(true)}>
                <FormField label="date" type="text" value={inputVal} onChange={e => updateDateFromInput(e.target.value)} />
            </div>
            {showDatePicker && <div className="date-picker__container">
                <DatePickerHead currentMonth={getMonthStr(monthState)} currentYear={yearState} onChangeMonth={changeMonth} onChangeYear={changeYear} />
                <DatePickerBody monthDetails={monthDetails} today={todayTimestamp} selectedDay={selectedDay} onDateClick={setSelectedDay} />
            </div>}
        </div>
    );
};

export default DatePicker;