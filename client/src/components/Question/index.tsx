import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import QuestionAnswer from "../QuestionAnswer";
import "./Question.scoped.scss";

interface QuestionProps {
    question: models.dtos.QuestionDto;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
    const [selection, setSelection] = useState<boolean[]>(Array(question.answers.length).fill(false));
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
    }
    return (
        <div className="question-item">
            <p className="question-item__title">{question.title}</p>
            <div
                className={`question-item__questions ${
                    question.alignment === models.enums.Alignment.Horizontal ? "horizontal" : ""
                }`}>
                {question.answers.map((ans, i) => (
                    <QuestionAnswer
                        answerIndex={i}
                        mode={{ isEditMode: false, alignment: question.alignment }}
                        questionType={question.type}
                        content={ans.content}
                        selected={selection[i]}
                        onSelectionChange={() => onSelectionChange(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Question;
