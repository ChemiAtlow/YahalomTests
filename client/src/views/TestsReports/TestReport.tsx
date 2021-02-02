import { models } from "@yahalom-tests/common";
import React, { useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Autocomplete, Column, Container, DataTable, ErrorModal, ExamReviewModal, Icon, Row, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";

interface StudentReportProps {
    match: match<{ testId: models.classes.guid }>;
}

const StudentReport: React.FC<StudentReportProps> = ({ match }) => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [examResults, setExamResults] = useState<models.interfaces.ExamResult[]>([]);
    const [test, setTest] = useState<models.interfaces.Test>();
    const [examsAutoComplete, setExamsAutoComplete] = useState<string[]>([]);
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();
    const { testId } = match.params;

    const columns: Column[] = [
        {
            label: "Test name",
            key: "title",
            sortable: true,
        },
        {
            label: "Grade",
            key: "grade",
            sortable: true,
        },
        {
            label: "Last activity",
            key: "completionDate",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "",
            key: "id",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View student's answers"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => openStudentExamResult(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const openStudentExamResult = (id: models.classes.guid) => {
        const examResult = examResults.find(ex => ex.id === id);
        if (!examResult) { return; }
        openModal(ExamReviewModal, { examResult });
    };
    const passingStudents = useMemo(
        () => examResults.reduce((prev, {grade, minPassGrade}) => grade < minPassGrade ? prev : prev + 1, 0),
        [examResults]
    );
    const averageGrade = useMemo(() => {
        const totalGrades = examResults.reduce((prev, {grade}) => prev + grade, 0);
        return Math.ceil(totalGrades / examResults.length);
    }, [examResults]);
    const medianGrade = useMemo(() => {
        if (examResults.length === 0) {
            return 0;
        }
        const mid = Math.floor(examResults.length / 2);
        const sortedArr = [...examResults].sort(({ grade: a }, { grade: b }) => a - b);
        return examResults.length % 2 !== 0 ? sortedArr[mid].grade : (sortedArr[mid - 1].grade + sortedArr[mid].grade) / 2;
    }, [examResults]);
    const successRate = useMemo(
        () => (passingStudents / examResults.length) * 100,
        [examResults, passingStudents]
    );

    useEffect(() => {
        const suggestions = examResults.flatMap(({ title,id }) => [title,id]);
        setExamsAutoComplete(suggestions);
    }, [examResults, setExamsAutoComplete]);
    useEffect(() => {
        setLoadingState("loading");
        reportService.getTestReport(
            buildAuthRequestData(), testId)
            .then(({ data }) => {
                setExamResults(data.exams);
                setTest(data.test);
            })
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, openModal, testId]);

    return (
        <Container>
            <h1>Test report</h1>
            <Row>
                <p><b>Test name:</b> {test?.title}.</p>
                <p><b>Test ID:</b> {test?.id}.</p>
                <p><b>Amount of questions:</b> {test?.questions.length}.</p>
                <p><b>Minimal passing grade:</b> {test?.minPassGrade}.</p>
                <p><b>Report's date range:</b> Always.</p>
                <p><b>Subbmissions:</b> {examResults.length}.</p>
                <p><b>Students whov'e passed:</b> {passingStudents}.</p>
                <p><b>Success rate:</b> {successRate.toFixed(2)}%</p>
                <p><b>Average grade:</b> {averageGrade}.</p>
                <p><b>Median grade:</b> {medianGrade}.</p>
            </Row>
            <SearchRow>
                <div />
                <Autocomplete options={examsAutoComplete} label="Search by test name/id" value={search} onChange={setSearch} />
            </SearchRow>
            <DataTable data={examResults} columns={columns} searchTerm={search} searchKeys={["id", "test", "title"]} />
        </Container>
    );
};

export default StudentReport;
