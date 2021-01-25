import { models } from "@yahalom-tests/common";
import React from "react";
import { FormField } from "../Forms";
import Icon from "../Icon";
import "./QuestionAnswer.scoped.scss";

type EditMode = {
    isEditMode: true;
    onContentChange: React.ChangeEventHandler<HTMLInputElement>;
    onAnswerRemove: React.MouseEventHandler<SVGElement>;
};
type ExamMode = {
    isEditMode?: false;
    alignment: models.enums.Alignment;
};
type QuestionAnswerProps = {
    content: string;
    selected: boolean;
    answerIndex: number;
    questionType: models.enums.QuestionType;
    mode: EditMode | ExamMode;
    onSelectionChange: React.ChangeEventHandler<HTMLInputElement>;
};

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
    content,
    selected,
    answerIndex,
    questionType,
    mode,
    onSelectionChange,
}) => {
    const selectionType =
        questionType === models.enums.QuestionType.MultiChoice ? "checkbox" : "radio";
    return (
        <div className="question__answer">
            <div className="question__answer-selection">
                <input type={selectionType} checked={selected} onChange={onSelectionChange} />
                {mode.isEditMode && <Icon icon="close" color="#969696" size={22} onClick={mode.onAnswerRemove} />}
            </div>
            <div className="question__answer-content">
                {mode.isEditMode ? (
                    <FormField
                        label={`Answer ${answerIndex + 1}`}
                        type="textarea"
                        value={content}
                        onChange={mode.onContentChange}
                    />
                ) : (
                    <p>{content}</p>
                )}
            </div>
        </div>
    );
};

export default QuestionAnswer;
