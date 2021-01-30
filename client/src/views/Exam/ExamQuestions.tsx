import { models } from '@yahalom-tests/common';
import React, { useCallback, useEffect, useState } from 'react';
import { match, useLocation } from 'react-router-dom';
import { useLoading } from '../../hooks';
import { examService } from '../../services';

interface ExamProps {
    match: match<{ examId: models.classes.guid; page?: string }>;
}

const ExamQuestions: React.FC<ExamProps> = ({ match }) => {
    const { examId, page } = match.params;
    const pageNumber = isNaN(Number(page)) ? -1 : Number(page);
    const { state } = useLocation<{ exam?: models.interfaces.Exam }>();
    const [exam, setExam] = useState<models.interfaces.Exam | models.interfaces.ExamResult>();
    const { setLoadingState } = useLoading();
    const isExamResult = useCallback((exam: any): exam is models.interfaces.ExamResult => exam.hasOwnProperty('originalQuestions'), []);
    useEffect(() => {
        if (examId && state?.exam) {
            setExam(state.exam);
        }
        else if (examId && !state?.exam) {
            setLoadingState("loading");
            examService.getExam(examId)
                .then(({ data }) => {
                    setExam(data);
                    setLoadingState("success")
                }).catch(err => setLoadingState("failure", `An error occoured while loading the exam:\n${err?.message || ""}`))
        }
    }, [state, examId, setExam, setLoadingState])
    if (isExamResult(exam)) {
        return <p>{exam.message}</p>
    } else {
        return pageNumber < 0 ?
            <>
            <h1>{exam?.title}</h1>
            <p>{exam?.intro}</p>
            </>
            : <p>{exam?.questions[pageNumber].title}</p>
    }
}

export default ExamQuestions
