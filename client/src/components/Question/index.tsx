import { models } from "@yahalom-tests/common";
import React, { useState } from "react";
import QuestionAnswer from "../QuestionAnswer";
import "./Question.scoped.scss";

type QuestionProps = {
    question: models.dtos.QuestionDto | models.interfaces.AnsweredQuestion;
    mode: "review" | "test";
    highlightedAnswers?: models.interfaces.Answer[];
    selectionState?: [boolean[], (selection: boolean[]) => void];
}

const Question: React.FC<QuestionProps> = ({ question, mode, selectionState, highlightedAnswers }) => {
    const [selection, setSelection] = useState<boolean[]>(
        Array(question.answers.length).fill(false)
    );
    const conditionalSelection = selectionState?.[0] || selection;
    const conditionalSetSelection = selectionState?.[1] || setSelection;

    const onSelectionChange = ((index: number) => {
        let cloned;
        if (question.type === models.enums.QuestionType.MultiChoice) {
            cloned = [...conditionalSelection];
            cloned[index] = !cloned[index];
        } else {
            cloned = Array(question.answers.length).fill(false);
            cloned[index] = true;
        }
        conditionalSetSelection(cloned);
    });
    return (
        <div className="question-item">
            <h3 className="question-item__title">{question.title}</h3>
            {question.additionalContent && <p className="question-item__additional">{question.additionalContent}</p>}
            <div
                className={`question-item__questions ${question.alignment === models.enums.Alignment.Horizontal ? "horizontal" : ""
                    }`}>
                {question.answers.map((ans, i) => (
                    <QuestionAnswer
                        key={i}
                        answerIndex={i}
                        mode={{ isEditMode: false, highlighted: highlightedAnswers?.[i].correct, alignment: question.alignment, isReview: mode === "review" }}
                        questionType={question.type}
                        {...ans}
                        selected={conditionalSelection[i]}
                        onSelectionChange={() => onSelectionChange(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Question;
