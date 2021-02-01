import { models } from "@yahalom-tests/common";
import React from "react";
import { Row, QuestionAnswer, AppButton, Container } from "../../../components";
import type { QuestionAnswersKeys } from "./types";

interface QuestionAnswersProps {
    question: QuestionAnswersKeys;
    onChange: (change: Pick<QuestionAnswersKeys, "answers">) => void;
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ question, onChange }) => {
    const onCorrectAnswerChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        //check if question is singlechoice
        if (question.type === models.enums.QuestionType.SingleChoice) {
            question.answers.forEach((answer, i) => {
                answer.correct = index === i;
            })
        }
        else {
            question.answers[index].correct = e.target.checked;
        }
        onChange({ answers: question.answers });
    };
    //needs to add new answer to existing question
    const onContentChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { answers } = question;
        const { value } = e.target;
        answers[index].content = value;
        //automatically add new answer
        if (answers.length < 10 && index === answers.length - 1 && value) {
            answers.push({ content: "", correct: false });
        }
        //automatically remove last answer.
        else if (index === answers.length - 2 && !value && !answers?.[index + 1]?.content) {
            answers.pop();
        }
        onChange({ answers });
    };
    const onAnswerRemove = (index: number) => {
        if (question.answers.length === 1) {
            return;
        }
        question.answers.splice(index, 1);
        onChange({ answers: question.answers })
    }
    const onAnswerAdd = () => {
        if (question.answers.length >= 10) {
            return;
        }
        onChange({ answers: [...question.answers, { content: "", correct: false }] });
    }
    return (
        <Container>
            <Row>
                {question.answers.map(({ content, correct }, i) => (
                    <QuestionAnswer
                        key={i}
                        questionType={question.type}
                        content={content}
                        answerIndex={i}
                        mode={{
                            isEditMode: true,
                            onContentChange: e => onContentChange(e, i),
                            onAnswerRemove: () => onAnswerRemove(i)
                        }}
                        selected={correct}
                        onSelectionChange={e => onCorrectAnswerChanged(e, i)}
                    />
                ))}
                {question.answers.length < 10 && <AppButton type="button" onClick={onAnswerAdd}>Add answer</AppButton>}
            </Row>
        </Container>
    );
};
