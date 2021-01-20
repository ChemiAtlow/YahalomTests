import { models } from "@yahalom-tests/common";
import React from "react";
import { FormField } from "../Forms";

type EditMode = {
    isEditMode: true;
    onContentChange: React.ChangeEventHandler<HTMLInputElement>;
};
type ExamMode = {
    isEditMode?: false;
    alignment: models.enums.Alignment;
};
type QuestionAnswerProps = {
    answer: models.interfaces.Answer;
    answerIndex: number;
    questionType: models.enums.QuestionType;
    mode: EditMode | ExamMode;
    onSelectionChange: React.ChangeEventHandler<HTMLInputElement>
};

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
    answer,
    answerIndex,
    questionType,
    mode,
    onSelectionChange,
}) => {
    const selectionType =
        questionType === models.enums.QuestionType.MultiChoice ? "checkbox" : "radio";
    return (
        <div className={`question__answer ${mode.isEditMode ? "" : mode.alignment}`}>
            <input type={selectionType} onChange={onSelectionChange} />
            {mode.isEditMode ? (
                <FormField
                    label={`Answer ${answerIndex}`}
                    type="textarea"
                    value={answer.content}
                    onChange={mode.onContentChange}
                />
            ) : (
                <p>{answer.content}</p>
            )}
        </div>
    );
};

export default QuestionAnswer;
