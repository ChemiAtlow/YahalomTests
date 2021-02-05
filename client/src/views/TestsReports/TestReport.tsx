import { models } from "@yahalom-tests/common";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Accordion, AccordionSection, Autocomplete, Column, Container, DataTable, ErrorModal, ExamReviewModal, Icon, QuestionPeekModal, Row, SearchRow, Tooltip } from "../../components";
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
    const [questionData, setQuestionData] = useState<models.interfaces.Question[]>([]);
    const [examResults, setExamResults] = useState<models.interfaces.ExamResult[]>([]);
    const [test, setTest] = useState<models.interfaces.Test>();
    const [examsAutoComplete, setExamsAutoComplete] = useState<string[]>([]);
    const [questionsAutoComplete, setQuestionsAutoComplete] = useState<string[]>([]);
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();
    const { testId, start, end } = match.params;
    const startDate = useMemo(() => Number(start) || 0, [start]);
    const endDate = useMemo(() => Number(end) || 0, [end]);

    const buildQuestionData = useCallback((questions: models.interfaces.Question[], examResults: models.interfaces.ExamResult[]) => {
        //local variables for calculating
        const questionsDataArray = questions.map<questionData>((question) => { //Iterates on each question
            //Iterates each examResult answeredQuestions
            const [submissionsCount, correctAnswersCount] = examResults.reduce<[submissionsCount: number, correctAnswersCount: number]>(([total, correct], {answeredQuestions}) => {
                //check weather or not the answer in correct and add it to questionData.
                const answer = answeredQuestions?.find(aq => aq.questionId === question.id);
                const isAnswerCorrect = answer?.answers.reduce((prev, { correct }, i) => correct === question.answers[i].correct && prev, true);
                total = answer ? total + 1 : total;
                correct = isAnswerCorrect ? correct + 1 : correct;
                return [total, correct];
            }, [0,0]);
            return { ...question, submissionsCount, correctAnswersCount };
        });
        setQuestionData(questionsDataArray);
    }, [setQuestionData]);

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
            key: "*",
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
            label: "Number of submissions",
            key: "submissionsCount",
            sortable: true
        },
        {
            label: "Answered correctly",
            key: "*",
            sortable: true,
            template: ({ data }) => <span>{
                (data.submissionsCount !== 0 ? ((data.correctAnswersCount / data.submissionsCount) * 100) : 0).toFixed(2)
            }%</span>,
        },
        {
            label: "",
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View question's available answers"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => openQuestionOptions(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const openStudentExamResult = (examResult: models.interfaces.ExamResult) => {
        openModal(ExamReviewModal, { examResult });
    };
    const openQuestionOptions = (question: models.interfaces.Question) => {
        openModal(QuestionPeekModal, { question });
    };
    const [passingStudents, averageGrade, successRate] = useMemo(() => {
        const [passingStudents, totalGrades] = examResults.reduce(([passing, totalGrades], { grade, minPassGrade }) => {
            const passed = grade < minPassGrade ? passing : passing + 1;
            return [passed, totalGrades + grade];
        }, [0, 0]);
        const average = Math.ceil(totalGrades / examResults.length);
        const rate = (passingStudents / examResults.length) * 100;
        return[passingStudents, average, rate]
    }, [examResults]);
    const medianGrade = useMemo(() => {
        if (examResults.length === 0) {
            return 0;
        }
        const mid = Math.floor(examResults.length / 2);
        const sortedArr = [...examResults].sort(({ grade: a }, { grade: b }) => a - b);
        return examResults.length % 2 !== 0 ? sortedArr[mid].grade : (sortedArr[mid - 1].grade + sortedArr[mid].grade) / 2;
    }, [examResults]);

    useEffect(() => {
        const suggestions = examResults.flatMap(({ title, id }) => [title, id]);
        setExamsAutoComplete(suggestions);
    }, [examResults, setExamsAutoComplete]);
    useEffect(() => {
        const suggestions = questionData.flatMap(({ title, id, label }) => [title, id!, label]);
        setQuestionsAutoComplete(suggestions);
    }, [questionData, setQuestionsAutoComplete]);
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
                buildQuestionData(unionArray, data.exams);
            })
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, buildQuestionData, openModal, testId, start, end]);

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
                        <p><b>Report's date range:</b> {
                            startDate ? new Date(startDate).toLocaleDateString() : "The big bang"
                        } - {
                            endDate ? new Date(endDate).toLocaleDateString() : "End of time"
                        }.</p>
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
