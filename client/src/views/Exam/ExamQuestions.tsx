import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react';
import { match, useLocation } from 'react-router-dom';
import { examService } from '../../services';

interface ExamProps {
    match: match<{ examId: models.classes.guid }>;
}

const ExamQuestions: React.FC<ExamProps> = ({ match }) => {
    const { examId } = match.params;
    const { state } = useLocation<{ exam?: models.interfaces.Exam }>();
    const [exam, setExam] = useState<models.interfaces.Exam>();
    useEffect(() => {
        if (examId && state?.exam) {
            setExam(state.exam);
        }
        // else if (examId && !state?.exam) {
        //     examService.getQuestion(buildAuthRequestData(), examId)
        //         .then(({ data }) => setExam(data))
        //         .catch(err => openModal(ErrorModal, {
        //             title: "Error loading exam",
        //             body: `An error occoured while loading the exam:\n${err?.message || ""}`
        //         }))
        // }
    }, [state, examId, setExam])

    return (
        <div>
            {state?.exam?.id}
            {examId}
        </div>
    )
}

export default ExamQuestions
