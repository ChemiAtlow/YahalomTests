import { models } from "@yahalom-tests/common";
import React, { useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Accordion, AccordionSection, Autocomplete, Column, Container, DataTable, ErrorModal, ExamReviewModal, Icon, Row, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";

interface StudentReportProps {
    match: match<{ testId: models.classes.guid }>;
}

const TestReport: React.FC<StudentReportProps> = ({ match }) => {
    const { openModal } = useModal();
    const [examSearch, setExamSearch] = useState("");
    const [questionSearch, setQuestionSearch] = useState("");
    const [questions, setQuestions] = useState<models.interfaces.Question[]>([]);
    const [examResults, setExamResults] = useState<models.interfaces.ExamResult[]>([]);
    const [test, setTest] = useState<models.interfaces.Test>();
    const [examsAutoComplete, setExamsAutoComplete] = useState<string[]>([]);
    const [questionsAutoComplete, setQuestionsAutoComplete] = useState<string[]>([]);
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();
    const { testId } = match.params;
    let submissionsNumber = useMemo(() => {
        let count = 0;
        questions.forEach(({ id: qId }) => {
            count = examResults.filter(({ answeredQuestions }) =>
                answeredQuestions?.reduce((prev, { questionId, answers }) => {
                    if (answers.filter(a => a.correct === true).length > 0 && questionId === qId) {
                        return prev + 1;
                    }
                    return prev;
                }, 0)
            ).length
        });
        return count;
    }, [examResults, questions]);

    // const answeredCorrectly = useMemo(() => {
    //     const correctAnswered = examResults.reduce((prev, { answeredQuestions, originalQuestions }) => {
    //         if (originalQuestions !== undefined) {
    //             originalQuestions.forEach(({ answers }, i) => {
    //                 return answers.filter(({ correct }, j) =>
    //                     (correct === true && answeredQuestions?.[i].answers[j].correct === correct)).length < 1 ? prev : prev + 1;
    //             });
    //         }            
    //         return prev;
    //     }, 0);
    //     return correctAnswered / submissionsNumber;
    // }, [examResults]);

    const columns: Column[] = [
        {
            label: "Student name",
            key: "studentName",
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

    const QuestionsStatisticColumns: Column[] = [
        {
            label: "Question",
            key: "title",
            sortable: true,
        },
        {
            label: "Tags",
            key: "label",
            sortable: true,
        },
        {
            label: "Submitted",
            key: "lastUpdate",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "Number of submissions",
            key: "*",
            sortable: true,
            template: ({ data }) => <span>{submissionsNumber}</span>,
        },
        // {
        //     label: "Answered correctly",
        //     key: "grade",
        //     sortable: true,
        //     template: ({ data }) => <span>{answeredCorrectly}</span>,
        // },
    ];

    const openStudentExamResult = (id: models.classes.guid) => {
        const examResult = examResults.find(ex => ex.id === id);
        if (!examResult) { return; }
        openModal(ExamReviewModal, { examResult });
    };
    const passingStudents = useMemo(
        () => examResults.reduce((prev, { grade, minPassGrade }) => grade < minPassGrade ? prev : prev + 1, 0),
        [examResults]
    );
    const averageGrade = useMemo(() => {
        const totalGrades = examResults.reduce((prev, { grade }) => prev + grade, 0);
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
        const suggestions = examResults.flatMap(({ title, id }) => [title, id]);
        setExamsAutoComplete(suggestions);
    }, [examResults, setExamsAutoComplete]);
    useEffect(() => {
        const suggestions = questions.flatMap(({ title, id, label }) => [title, id!, label]);
        setQuestionsAutoComplete(suggestions);
    }, [questions, setQuestionsAutoComplete]);
    useEffect(() => {
        setLoadingState("loading");
        reportService.getTestReport(
            buildAuthRequestData(), testId)
            .then(({ data }) => {
                setExamResults(data.exams);
                setTest(data.test);
                setQuestions(data.originalQuestions);
            })
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, openModal, testId]);

    return (
        <Container>
            <h1>Test report</h1>
            <Accordion>
                <AccordionSection title="Summary" >
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
                </AccordionSection>
                <AccordionSection title="Exam results">
                    <SearchRow>
                        <div />
                        <Autocomplete options={examsAutoComplete} label="Search by test name/id" value={examSearch} onChange={setExamSearch} />
                    </SearchRow>
                    <DataTable data={examResults} columns={columns} searchTerm={examSearch} searchKeys={["id", "test", "title"]} />
                </AccordionSection>
                <AccordionSection title="Questions statistics">
                    <SearchRow>
                        <div />
                        <Autocomplete options={questionsAutoComplete} label="Search by question name/id/label" value={questionSearch} onChange={setQuestionSearch} />
                    </SearchRow>
                    <DataTable data={questions} columns={QuestionsStatisticColumns} searchTerm={questionSearch} searchKeys={["id", "label", "title"]} />
                </AccordionSection>
            </Accordion>
        </Container>
    );
};

export default TestReport;
