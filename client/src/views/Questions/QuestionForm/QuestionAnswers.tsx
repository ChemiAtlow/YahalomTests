import { models } from "@yahalom-tests/common";
import React from "react";
import { Row, QuestionAnswer, AppButton } from "../../../components";


export type QuestionAnswersKeys = Pick<models.interfaces.Question, "type" | "answers">;
interface QuestionAnswersProps {
    question: QuestionAnswersKeys;
    onChange: (change: Partial<QuestionAnswersKeys>) => void;
    onValidityChange: (change: string) => void;
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ question, onChange, onValidityChange }) => {
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
        validate();
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
        validate();
        onChange({ answers });
    };
    const onAnswerRemove = (index: number) => {
        if (question.answers.length === 1) {
            return;
        }
        question.answers.splice(index, 1);
        validate();
        onChange({ answers: question.answers })
    }
    const onAnswerAdd = () => {
        if (question.answers.length >= 10) {
            return;
        }
        onChange({ answers: [...question.answers, { content: "", correct: false }] });
        validate();
    }
    const validate = () => {
        const { answers } = question;
        const errors: string[] = [];
        //Check at least 2 questions exist
        if (answers.length < 2) {
            errors.push("at least 2 answers are required")
        }
        //only last answer can be empty
        if (answers.some((ans, i) => !ans.content.trim() && i !== answers.length - 1)) {
            errors.push("Empty answers are invalid");
        }
        //empty answer can't be correct
        if (answers.some(ans => !ans.content.trim() && ans.correct)) {
            errors.push("Empty answer can't be correct")
        }
        //no answer is marked as correct
        if (!answers.some(ans => ans.correct)) {
            errors.push("At least one question must be correct")
        }
        let errMsg = "";
        if (errors.length === 1) {
            errMsg = `Error: ${errors[0]}`
        } else if (errors.length > 1) {
            errMsg = `Errors: ${errors.join(", ")}`
        }
        onValidityChange(errMsg)
    }
    return (
        <div className="container">
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
        </div>
    );
};
