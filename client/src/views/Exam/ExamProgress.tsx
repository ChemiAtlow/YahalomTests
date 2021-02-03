import { models } from '@yahalom-tests/common';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { match, useHistory, useLocation } from 'react-router-dom';
import { ErrorModal, WarningModal } from '../../components';
import ExamQuestions from '../../components/ExamQuestions';
import { useLoading, useModal } from '../../hooks';
import { examService } from '../../services';
import { isExamAnExamResult } from '../../utils';
import ExamIntro from './ExamIntro';

type ExamRouteProps = { examId: models.classes.guid; testId: models.classes.guid; page?: string }

interface ExamProps {
    match: match<ExamRouteProps>;
}

const ExamProgress: React.FC<ExamProps> = ({ match }) => {
    const { examId, page, testId } = match.params;
    const pageNumber = isNaN(Number(page)) ? -1 : Number(page);
    const { state } = useLocation<{ exam?: models.interfaces.Exam }>();
    const [exam, setExam] = useState<models.interfaces.Exam | models.interfaces.ExamResult>();
    const { setLoadingState } = useLoading();
    const { push } = useHistory();
    const { openModal } = useModal();
    const isExamResult = useCallback((exam: any): exam is models.interfaces.ExamResult => exam?.hasOwnProperty('questionCount'), []);
    const isIntroPage = useMemo(() => {
        const isExamInvalidPages = exam && !isExamAnExamResult(exam) && pageNumber > exam.questions.length - 1;
        const isResultInvalidPages = isExamAnExamResult(exam) &&
            (pageNumber > (exam.originalQuestions?.length || 0) - 1 ||
                !exam.isReviewEnabled || !exam.originalQuestions || !exam.answeredQuestions);
        return pageNumber < 0 || isExamInvalidPages || isResultInvalidPages;
    }, [exam, pageNumber]);
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
            setLoadingState("loading");
            try {
                const { data } = await examService.submitExam(examId);
                setExam(data);
                push(`/exam/${testId}/${examId}`);
            } catch (error) {
                openModal(ErrorModal, { title: "Error", body: "Couldn't submit your test, please try again." })
            } finally {
                setLoadingState("success");
            }
        };
    };

    if (exam === undefined || exam === null) {
        return <p>Loading</p >
    } else if (isIntroPage) {
        return <ExamIntro exam={exam} onStartExamOrReview={() => changePage(0)} />
    } else if (true) {
        return <ExamQuestions { ...{exam, changePage, submitExam} } currentPage={pageNumber} selectionStateBuilder={selectionState} />
    }
}

export default ExamProgress
