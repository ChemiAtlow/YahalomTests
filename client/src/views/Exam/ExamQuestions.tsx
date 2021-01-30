import { models } from '@yahalom-tests/common';
import React, { useCallback, useEffect, useState } from 'react';
import { match, useHistory, useLocation } from 'react-router-dom';
import { AppButton, Container, ErrorModal, FixedFooter, Pagination, WarningModal } from '../../components';
import Question from '../../components/Question';
import { useLoading, useModal } from '../../hooks';
import { examService } from '../../services';

type ExamRouteProps = { examId: models.classes.guid; testId: models.classes.guid; page?: string }

interface ExamProps {
    match: match<ExamRouteProps>;
}

const ExamQuestions: React.FC<ExamProps> = ({ match }) => {
    const { examId, page, testId } = match.params;
    const pageNumber = isNaN(Number(page)) ? -1 : Number(page);
    const { state } = useLocation<{ exam?: models.interfaces.Exam }>();
    const [exam, setExam] = useState<models.interfaces.Exam | models.interfaces.ExamResult>();
    const { setLoadingState } = useLoading();
    const { push } = useHistory();
    const { openModal } = useModal();
    const isExamResult = useCallback((exam: any): exam is models.interfaces.ExamResult => exam?.hasOwnProperty('questionCount'), []);
    useEffect(() => {
        if (state?.exam) {
            setExam(state.exam);
        }
        else {
            setLoadingState("loading");
            examService.getExam(examId)
                .then(({ data }) => {
                    setExam(data);
                    setLoadingState("success")
                }).catch(err => setLoadingState("failure", `An error occoured while loading the exam:\n${err?.message || ""}`))
        }
    }, [state, examId, setExam, setLoadingState])

    const changePage = (page: number) => {
        if (!isExamResult(exam)) {
            updateExam();
        }
        push(`/exam/${testId}/${examId}/${page}`);
    };

    const updateExam = async () => {
        if (isExamResult(exam) || !exam || pageNumber < 0) { return; }
        const { questionId, answers } = exam.questions?.[pageNumber];
        const correctAnswersIndex = answers.reduce((prev, current, index) => {
            return current.correct ? [...prev, index] : prev;
        }, Array<number>());
        try {
            await examService.updateExam(
                examId, { questionId: questionId, answers: correctAnswersIndex });
        } catch (error) {
            openModal(ErrorModal, { title: "Error!", body: `Couldn't save your answer at page ${pageNumber + 1}` });
        }
    };

    const selectionState: () => [boolean[], (selections: boolean[]) => void] = () => {
        if (isExamResult(exam)) {
            const selections = exam.answeredQuestions?.[pageNumber].answers.map(({ correct }) => correct);
            return [selections || [], () => { }];
        } else if (exam !== undefined) {
            const question = exam.questions[pageNumber];
            const selections = question.answers.map(({ correct }) => correct);
            const setSelections = (selections: boolean[]) => {
                question.answers.forEach((a, i) => { a.correct = selections[i] });
                setExam({ ...exam });
            };
            return [selections || [], setSelections];
        } else {
            return [[], () => { }];
        }
    };

    const submitExam = async () => {
        const update = updateExam();
        const modal = openModal(WarningModal, {
            title: "Are you sure?",
            body: "Once you submit the test you canno't edit it.\nAre you sure you want to submit?",
            cancelText: "Submit anyway",
            okText: "Cancel"
        }).promise;
        const [, shouldProceed] = await Promise.all([update, modal]);
        if (shouldProceed) {
            try {
                const { data } = await examService.submitExam(examId);
                setExam(data);
                console.log(data);
            } catch (error) {
                openModal(ErrorModal, { title: "Error", body: "Couldn't submit your test, please try again." })
            }
        };
    };
    console.log(exam);

    if (exam === undefined || exam === null) {
        return <p>Loading</p >
    } else if (isExamResult(exam)) {
        const allowReview = exam.isReviewEnabled && exam.originalQuestions && exam.answeredQuestions;
        if (!allowReview ||
            pageNumber > (exam.originalQuestions?.length || 0) - 1 ||
            pageNumber < 0) {
            return (<>
                <p>{exam.message}</p>
                {allowReview && <AppButton onClick={() => changePage(0)}>Start review</AppButton>}
            </>)
        } else {
            return (
                <FixedFooter>
                    <Container>
                        <Question selectionState={selectionState()} question={exam.answeredQuestions![pageNumber]} highlightedAnswers={exam.originalQuestions![pageNumber].answers} mode="review" />
                    </Container>
                    <div>
                        {//diplay next question button when valid
                            pageNumber > 0 &&
                            <AppButton varaiety="small" onClick={() => changePage(pageNumber - 1)}>{"<"}</AppButton>
                        }
                        <Pagination currentPage={pageNumber + 1} maximalPage={exam.answeredQuestions!.length} onClick={p => changePage(p - 1)} />
                        {
                            pageNumber < exam.answeredQuestions!.length - 1 &&
                            < AppButton varaiety="small" onClick={() => changePage(pageNumber + 1)}>{">"}</AppButton>
                        }
                    </div>
                </FixedFooter >
            )
        }

    } else if (pageNumber < 0 || pageNumber > exam.questions.length - 1) {
        return <>
            <h1>{exam.title}</h1>
            <p>{exam.intro}</p>
            <AppButton onClick={() => changePage(0)}>Start exam</AppButton>
        </>
    } else {
        return (
            <FixedFooter>
                <Container>
                    <Question selectionState={selectionState()} question={exam.questions[pageNumber]} mode="test" />
                </Container>
                <div>
                    {//diplay next question button when valid
                        pageNumber > 0 &&
                        <AppButton varaiety="small" onClick={() => changePage(pageNumber - 1)}>{"<"}</AppButton>
                    }
                    <Pagination currentPage={pageNumber + 1} maximalPage={exam.questions.length} onClick={p => changePage(p - 1)} />
                    {
                        pageNumber < exam.questions.length - 1 &&
                        < AppButton varaiety="small" onClick={() => changePage(pageNumber + 1)}>{">"}</AppButton>
                    }
                    {
                        pageNumber === exam.questions.length - 1 &&
                        < AppButton onClick={submitExam}>Submit</AppButton>
                    }
                </div>
            </FixedFooter >
        )
    }
}

export default ExamQuestions
