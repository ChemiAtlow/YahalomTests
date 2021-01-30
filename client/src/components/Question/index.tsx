import { models } from "@yahalom-tests/common";
import React, { useState } from "react";
import QuestionAnswer from "../QuestionAnswer";
import "./Question.scoped.scss";

interface QuestionProps {
    question: models.dtos.QuestionDto | models.interfaces.AnsweredQuestion;
    mode: "review" | "test"
}

const Question: React.FC<QuestionProps> = ({ question, mode }) => {
    const [selection, setSelection] = useState<boolean[]>(
        Array(question.answers.length).fill(false)
    );
    const onSelectionChange = (index: number) => {
        let cloned;
        if (question.type === models.enums.QuestionType.MultiChoice) {
            cloned = [...selection];
            cloned[index] = !cloned[index];
        } else {
            cloned = Array(question.answers.length).fill(false);
            cloned[index] = true;
        }
        setSelection(cloned);
    };
    return (
        <div className="question-item">
            <p className="question-item__title">{question.title}</p>
            {question.additionalContent && <p className="question-item__additional">{question.additionalContent}</p>}
            <div
                className={`question-item__questions ${
                    question.alignment === models.enums.Alignment.Horizontal ? "horizontal" : ""
                }`}>
                {question.answers.map((ans, i) => (
                    <QuestionAnswer
                        key={i}
                        answerIndex={i}
                        mode={{ isEditMode: false, alignment: question.alignment, isReview: mode === "review" }}
                        questionType={question.type}
                        {...ans}
                        selected={selection[i]}
                        onSelectionChange={() => onSelectionChange(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Question;
