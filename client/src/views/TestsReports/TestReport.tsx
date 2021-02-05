import { models } from "@yahalom-tests/common";
import React, { useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Accordion, AccordionSection, Autocomplete, Column, Container, DataTable, ErrorModal, ExamReviewModal, Icon, Row, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";
import { unionArrays } from "../../utils";

interface StudentReportProps {
    match: match<{ 
        testId: models.classes.guid;
        start: string;
        end: string;
     }>;
};
interface questionData extends models.interfaces.Question {
    correctAnswersCount: number;
    submissionsCount: number;
};

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
    const { testId, start, end } = match.params;

    const questionData = useMemo(() => {
        //local variables for calculating
        let count = 0;
        const questionsDataArray = questions.map((question) => { //Iterates on each question
            let data: questionData = {
                correctAnswersCount: 0,
                submissionsCount: 0,
                type: models.enums.QuestionType.SingleChoice,
                title: "",
                answers: [],
                label: "",
                alignment: models.enums.Alignment.Horizontal,
                lastUpdate: 0,
                testCount: 0

            };
            //Iterates each examResult answeredQuestions
            count = examResults.filter(({ answeredQuestions }) => {
                let correctAnswerCount = 0;
                //check weather or not the answer in correct and add it to questionData.
                return answeredQuestions?.reduce((prev, { questionId, answers }) => {
                    if (answers.filter(a => a.correct === true).length > 0 && questionId === question.id) {
                        data = { ...data, ...question, correctAnswersCount: correctAnswerCount++ };
                        return prev + 1;
                    } else {
                        data = { ...data, ...question, correctAnswersCount: data.correctAnswersCount + 1 };
                        return prev;
                    }
                }, 0)
            }).length //return the length of objects filtered
            data = { ...data, submissionsCount: count } //update submissionsCount
            return data;
        });
        return questionsDataArray;
    }, [examResults, questions]);

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
            key: "submissionsCount",
            sortable: true
        },
        {
            label: "Answered correctly",
            key: "*",
            sortable: true,
            template: ({ data }) => <span>{
                data.submissionsCount !== 0 ? ((data.correctAnswersCount / data.submissionsCount) * 100) : 0}%</span>,
        },
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
        const startDate = Number(start) || 0;
        const endDate = Number(end) || 0;
        reportService.getTestReport(
            buildAuthRequestData(), testId, startDate, endDate)
            .then(({ data }) => {
                setExamResults(data.exams);
                setTest(data.test);
                data.originalQuestions.push(...data.exams.flatMap(({ originalQuestions }) => originalQuestions || []));
                const unionArray = unionArrays(data.originalQuestions);
                setQuestions(unionArray);
            })
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, openModal, testId, start, end]);

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
                    <DataTable data={questionData} columns={QuestionsStatisticColumns} searchTerm={questionSearch} searchKeys={["id", "label", "title"]} />
                </AccordionSection>
            </Accordion>
        </Container>
    );
};

export default TestReport;
