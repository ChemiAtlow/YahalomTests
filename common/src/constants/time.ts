const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const month = 30 * day;
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const currentYear = +new Date().getFullYear();
const currentMonth = +new Date().getMonth() + 1;
const CALENDAR_WEEKS = 6;
const DAYS_IN_WEEK = 7;
const zeroPad = (value: number, length = 2) => `${value}`.padStart(length, '0');
const getMonthDays = (month = currentMonth, year = currentYear) => {
    const months30 = [4, 6, 9, 11];
    const leapYear = year % 4 === 0;
    return month === 2 ? (leapYear ? 29 : 28) : months30.includes(month) ? 30 : 31;
};
const getMonthFirstDay = (month = currentMonth, year = currentYear) => {
    return +new Date(`${year}-${zeroPad(month, 2)}-01`).getDay() + 1;
};
const isDate = (date: object) => {
    const isDate = Object.prototype.toString.call(date) === '[object Date]';
    const isValidDate = date && !Number.isNaN(date.valueOf());
    return isDate && isValidDate;
};
const isSameMonth = (date: Date, basedate = new Date()) => {
    if (!isDate(date) || !isDate(basedate)) {
        return false;
    }
    const basedateMonth = basedate.getMonth() + 1;
    const basedateYear = basedate.getFullYear();

    const dateMonth = date.getMonth() + 1;
    const dateYear = date.getFullYear();

    return basedateMonth === dateMonth && basedateYear === dateYear;
};
const isSameDay = (date: Date, basedate = new Date()) => {
    if (!isDate(date) || !isDate(basedate)) {
        return false;
    }
    const basedateDate = basedate.getDate();
    const basedateMonth = basedate.getMonth() + 1;
    const basedateYear = basedate.getFullYear();

    const dateDate = date.getDate();
    const dateMonth = date.getMonth() + 1;
    const dateYear = date.getFullYear();

    return basedateDate === dateDate && basedateMonth === dateMonth && basedateYear === dateYear;
};
const getDateString = (date = new Date()) => {
    if (!isDate(date)) return null;
    return `${zeroPad(date.getDate())}/${zeroPad(date.getMonth() + 1)}/${date.getFullYear()}`;
};
const getPreviousMonth = (month: number, year: number) => {
    const prevMonth = month > 1 ? month - 1 : 12;
    const prevMonthYear = month > 1 ? year : year - 1;
    return { month: prevMonth, year: prevMonthYear };
};
const getNextMonth = (month: number, year: number) => {
    const nextMonth = month < 12 ? month + 1 : 1;
    const nextMonthYear = month < 12 ? year : year + 1;
    return { month: nextMonth, year: nextMonthYear };
};
const buildCalendar = (month = currentMonth, year = currentYear) => {
    const monthDays = getMonthDays(month, year);
    const monthFirstDay = getMonthFirstDay(month, year);
    // Get number of days to be displayed from previous and next months
    // These ensure a total of 42 days (6 weeks) displayed on the calendar
    const daysFromPrevMonth = monthFirstDay - 1;
    const daysFromNextMonth = CALENDAR_WEEKS * DAYS_IN_WEEK - (daysFromPrevMonth + monthDays);
    // Get the previous and next months and years
    const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(month, year);
    const { month: nextMonth, year: nextMonthYear } = getNextMonth(month, year);
    // Get number of days in previous month
    const prevMonthDays = getMonthDays(prevMonth, prevMonthYear);
    // Builds dates to be displayed from previous month
    const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
        const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
        return [prevMonthYear, zeroPad(prevMonth, 2), zeroPad(day, 2)];
    });
    // Builds dates to be displayed from current month
    const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
        const day = index + 1;
        return [year, zeroPad(month, 2), zeroPad(day, 2)];
    });
    // Builds dates to be displayed from next month
    const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
        const day = index + 1;
        return [nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2)];
    });
    // Combines all dates from previous, current and next months
    return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
};

export const TIME = {
    second,
    minute,
    hour,
    day,
    month,
    dayNames,
    monthNames,
    currentMonth,
    currentYear,
    CALENDAR_WEEKS,
    DAYS_IN_WEEK,
    zeroPad,
    getMonthDays,
    getMonthFirstDay,
    isDate,
    isSameMonth,
    isSameDay,
    getDateString,
    getPreviousMonth,
    getNextMonth,
};
