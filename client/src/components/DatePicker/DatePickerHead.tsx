import React from 'react';
import "./DatePickerHead.scoped.scss";

interface DatePickerHeadProps {
    onChangeYear: (change: number) => void;
    onChangeMonth: (change: number) => void;
    currentYear: number;
    currentMonth: string;
}

const DatePickerHead: React.FC<DatePickerHeadProps> = ({ onChangeMonth, onChangeYear, currentMonth, currentYear }) => {
    return (
        <div className="date-picker__head">
            <div className="date-picker__head-button">
                <div className="date-picker__head-button-inner" onClick={() => onChangeYear(-1)}>
                    <span className="date-picker__head-button-inner__left-arrows" />
                </div>
            </div>
            <div className="date-picker__head-button">
                <div className="date-picker__head-button-inner" onClick={() => onChangeMonth(-1)}>
                    <span className="date-picker__head-button-inner__left-arrow" />
                </div>
            </div>
            <div className="date-picker__head-container">
                <div className="date-picker__head-container__year">{currentYear}</div>
                <div className="date-picker__head-container__month">{currentMonth}</div>
            </div>
            <div className="date-picker__head-button">
                <div className="date-picker__head-button-inner" onClick={() => onChangeMonth(1)}>
                    <span className="date-picker__head-button-inner__right-arrow" />
                </div>
            </div>
            <div className="date-picker__head-button" onClick={() => onChangeYear(1)}>
                <div className="date-picker__head-button-inner">
                    <span className="date-picker__head-button-inner__right-arrows" />
                </div>
            </div>
        </div>
    );
};

export default DatePickerHead;