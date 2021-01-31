import { constants, models } from "@yahalom-tests/common";
import React from "react";
import { AppButton } from "../../components";
import { isExamAnExamResult } from "../../utils";
const { serverDomain, serverPort } = constants.URLS;

type ExamIntroProps = {
    exam: models.interfaces.ExamResult | models.interfaces.Exam;
    onStartExamOrReview: () => void;
};

const examResultIntroAdditions = (exam: models.interfaces.ExamResult, onStart: () => void) => {
    const allowReview = exam.isReviewEnabled && exam.originalQuestions && exam.answeredQuestions;
    return (
        <>
            <p>{exam.message}</p>
            <p>Your grade is: {exam.grade}</p>
            <p>
                You have answered: {exam.correctAnswersCount} questions correctly out of{" "}
                {exam.questionCount}.
            </p>
            {exam.grade >= exam.minPassGrade && (
                <p>
                    Get your certificate{" "}
                    <a href={`${serverDomain}:${serverPort}/exam/${exam.id}/cert`}>here</a>
                </p>
            )}
            {allowReview && <AppButton onClick={onStart}>Start review</AppButton>}
        </>
    );
};

const ExamIntro: React.FC<ExamIntroProps> = ({ exam, onStartExamOrReview }) => {
    return (
        <>
            <h1>{exam.title}</h1>
            <p>{exam.intro}</p>
            {isExamAnExamResult(exam) ? (
                examResultIntroAdditions(exam, onStartExamOrReview)
            ) : (
                <AppButton onClick={onStartExamOrReview}>Start exam</AppButton>
            )}
        </>
    );
};

export default ExamIntro;
