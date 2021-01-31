import { models } from "@yahalom-tests/common";
import React from "react";
import { isExamAnExamResult } from "../../utils";
import { AppButton } from "../Forms";
import { Container, FixedFooter } from "../Layout";
import Pagination from "../Pagination";
import Question from "../Question";

interface ExamQuestionsProps {
    exam: models.interfaces.Exam | models.interfaces.ExamResult;
    currentPage: number;
    changePage: (targetPage: number) => void;
    selectionStateBuilder: () => [boolean[], (selection: boolean[]) => void];
    submitExam?: () => Promise<void>;
}

const ExamQuestions: React.FC<ExamQuestionsProps> = ({
    exam,
    currentPage,
    changePage,
    submitExam,
    selectionStateBuilder,
}) => {
    const isExamAResult = isExamAnExamResult(exam);
    const examAsResult = (exam as unknown) as models.interfaces.ExamResult;
    const examAsExam = (exam as unknown) as models.interfaces.Exam;
    const questions = isExamAResult ? examAsResult.answeredQuestions : examAsExam.questions;
    let questionProps: React.ComponentProps<typeof Question> = {
        mode: isExamAResult ? "review" : "test",
        question: questions![currentPage],
        highlightedAnswers: isExamAResult
            ? examAsResult.originalQuestions![currentPage].answers
            : undefined,
    };
    return (
        <FixedFooter>
            <Container>
                <Question selectionState={selectionStateBuilder()} {...questionProps} />
            </Container>
            <div>
                {//diplay next question button when valid
                currentPage > 0 && (
                    <AppButton varaiety="small" onClick={() => changePage(currentPage - 1)}>
                        {"<"}
                    </AppButton>
                )}
                <Pagination
                    currentPage={currentPage + 1}
                    maximalPage={questions!.length}
                    onClick={p => changePage(p - 1)}
                />
                {currentPage < questions!.length - 1 && (
                    <AppButton varaiety="small" onClick={() => changePage(currentPage + 1)}>
                        {">"}
                    </AppButton>
                )}
                {isExamAResult && currentPage === questions!.length - 1 && (
                    <AppButton onClick={submitExam}>Submit</AppButton>
                )}
            </div>
        </FixedFooter>
    );
};

export default ExamQuestions;