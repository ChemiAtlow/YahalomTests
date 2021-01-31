import { lazy } from "react";

export const Exam = lazy(() => import(/* webpackChunkName: "Exam" */ "./Exam"));
export const Home = lazy(() => import(/* webpackChunkName: "Home" */"./Home"));
export const Login = lazy(() => import(/* webpackChunkName: "Login" */"./Login"));
export const Questions = lazy(() => import(/* webpackChunkName: "Questions" */"./Questions"));
export const Reports = lazy(() => import(/* webpackChunkName: "Reports" */"./StudentsReports"));
export const Restore = lazy(() => import(/* webpackChunkName: "Restore" */"./Restore"));
export const Tests = lazy(() => import(/* webpackChunkName: "Tests" */"./Tests"));