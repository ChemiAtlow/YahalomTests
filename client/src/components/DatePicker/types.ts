export type DateDetails = {
    date: number;
    day: number;
    month: number;
    timestamp: number;
    dayString: string;
};
export type DatePartials = {
    year: number;
    month: number;
    date: number;
};
export type DateArgs = {
    dayOfMonth: number;
    numberOfDaysInMonth: number;
    firstDayOfMonth: number;
    year: number;
    month: number;
};
