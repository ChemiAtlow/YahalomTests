import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react';
import { match, useLocation } from 'react-router-dom';
import { useLoading } from '../../hooks';
import { examService } from '../../services';

interface ExamProps {
    match: match<{ examId: models.classes.guid }>;
}

const ExamQuestions: React.FC<ExamProps> = ({ match }) => {
    const { examId } = match.params;
    const { state } = useLocation<{ exam?: models.interfaces.Exam }>();
    const [exam, setExam] = useState<models.interfaces.Exam>();
    const { setLoadingState } = useLoading();
    useEffect(() => {
        console.log(examId, state)
        if (examId && state?.exam) {
            setExam(state.exam);
        }
        else if (examId && !state?.exam) {
            examService.getExam(examId)
                .then(({ data }) => {
                    setExam(data);
                    setLoadingState("success")
                }).catch(err => setLoadingState("failure", `An error occoured while loading the exam:\n${err?.message || ""}`))
        }
    }, [state, examId, setExam, setLoadingState])

    return (
        <div>
            {exam?.student}
            {examId}
        </div>
    )
}

export default ExamQuestions
