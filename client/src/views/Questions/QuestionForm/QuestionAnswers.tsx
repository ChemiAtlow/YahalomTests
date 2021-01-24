import { models } from "@yahalom-tests/common";
import React from "react";
import { Row, QuestionAnswer } from "../../../components";


export type QuestionAnswersKeys = Pick<models.interfaces.Question, "type" | "answers">;
interface QuestionAnswersProps {
    question: QuestionAnswersKeys;
    onChange: (change: Partial<QuestionAnswersKeys>) => void;
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ question, onChange }) => {
    const onSelectionChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
        //check automatocaly add new answer
        if (answers.length < 10 && index === answers.length - 1 && value) {
            answers.push({ content: "", correct: false });
        } else if (index === answers.length - 2 && !value && !answers?.[index + 1]?.content) {
            answers.pop();
        }
        onChange({ answers });
    };
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
                        }}
                        selected={correct}
                        onSelectionChange={e => onSelectionChanged(e, i)}
                    />
                ))}
            </Row>
        </div>
    );
};
