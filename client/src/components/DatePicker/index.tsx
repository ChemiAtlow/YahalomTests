import { constants } from '@yahalom-tests/common';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormField } from '../Forms';
import type { DateArgs, DateDetails, DatePartials } from "./types";
import "./DatePicker.scoped.scss";
import DatePickerHead from './DatePickerHead';
import DatePickerBody from './DatePickerBody';
const { TIME } = constants;

const todayTimestamp =
    Date.now() - (Date.now() % TIME.day) + new Date().getTimezoneOffset() * 1000 * 60;
const DatePicker: React.FC = () => {
    const datePickerRef = useRef<HTMLDivElement>(null);
    const [inputVal, setInputVal] = useState("");
    const [monthDetails, setMonthDetails] = useState<DateDetails[]>();
    const [selectedDay, setSelectedDay] = useState(todayTimestamp);
    const [yearState, setYearState] = useState(0);
    const [monthState, setMonthState] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getNumberOfDays = useCallback((year: number, month: number) => {
        return 40 - new Date(year, month, 40).getDate();
    }, []);
    const getDayDetails = useCallback((args: DateArgs) => {
        let date = args.dayOfMonth - args.firstDayOfMonth;
        let day = args.dayOfMonth % 7;
        let prevMonth = args.month - 1;
        let prevYear = args.year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDaysInMonth) + 1;
        let month = date < 0 ? -1 : date >= args.numberOfDaysInMonth ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month,
            timestamp,
            dayString: TIME.dayNames[day]
        }
    }, [getNumberOfDays]);
    const getMonthDetails = useCallback<(year: number, month: number) => DateDetails[]>((year, month) => {
        let firstDayOfMonth = (new Date(year, month)).getDay();
        let numberOfDaysInMonth = getNumberOfDays(year, month);
        let monthArray = [];
        let currentDay = null;
        let rows = 6;
        let cols = 7;
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
        let dateData = dateValue.split('-').map(d => parseInt(d, 10));
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
        return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
    }, []);
    const setDate = useCallback<(dateData: DatePartials) => void>((dateData) => {
        const selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
        setSelectedDay(selectedDay);
        // if(this.props.onChange) {
        //     this.props.onChange(selectedDay);
        // }
    }, [setSelectedDay]);

    const updateDateFromInput = useCallback((newVal: string) => {
        setInputVal(newVal);
        const dateData = getDateFromDateString(newVal);
        if (dateData !== null) {
            setDate(dateData);
            setYearState(dateData.year);
            setMonthState(dateData.month - 1);
            setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
        }
    }, [setInputVal, setDate, setYearState, setMonthState, setMonthDetails, getDateFromDateString, getMonthDetails]);

    const setDateToInput = useCallback((timestamp: number) => {
        let dateString = getDateStringFromTimestamp(timestamp);
        setInputVal(dateString);
    }, [getDateStringFromTimestamp, setInputVal])

    const onDateClick = useCallback((day: DateDetails) => {
        setSelectedDay(day.timestamp);
        // if(this.props.onChange) {
        //     this.props.onChange(day.timestamp);
        // }
    }, [setSelectedDay]);

    const setYear = useCallback((offset: number) => {
        setYearState(yearState + offset);
        setMonthDetails(getMonthDetails(yearState, monthState));
    }, [yearState, monthState, setYearState, setMonthDetails, getMonthDetails]);

    const setMonth = useCallback((offset: number) => {
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
        const date = new Date();
        const year = date.getFullYear(), month = date.getMonth();
        setMonthState(month);
        setYearState(year);
        setMonthDetails(getMonthDetails(year, month));
    }, [setMonthState, setYearState, setMonthDetails, getMonthDetails]);
    useEffect(() => {
        const addBackdrop = (e: MouseEvent) => {
            if (showDatePicker && !datePickerRef.current?.contains(e.target as Node)) {
                setShowDatePicker(false);
            }
        };
        window.addEventListener('click', addBackdrop);
        return () => window.removeEventListener('click', addBackdrop);
    }, [setShowDatePicker, showDatePicker, datePickerRef]);
    useEffect(() => {
        console.log("SELECTED DAY CHANGE");
        setDateToInput(selectedDay);
    }, [selectedDay, setDateToInput])

    return (
        <div className="date-picker__wrapper" ref={datePickerRef}>
            <div className="date-picker__input" onClick={() => setShowDatePicker(true)}>
                <FormField label="date" type="text" value={inputVal} onChange={e => updateDateFromInput(e.target.value)} />
            </div>
            {showDatePicker && <div className="date-picker__container">
                <DatePickerHead currentMonth={getMonthStr(monthState)} currentYear={yearState} onChangeMonth={setMonth} onChangeYear={setYear} />
                <DatePickerBody monthDetails={monthDetails} today={todayTimestamp} selectedDay={selectedDay} onDateClick={onDateClick} />
            </div>}
        </div>
    );
};

export default DatePicker;