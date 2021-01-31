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
type ExamAndReviewMode = {
    isEditMode?: false;
    alignment: models.enums.Alignment;
    isReview?: boolean;
    highlighted?: boolean;
};
type QuestionAnswerProps = {
    content: string;
    correct?: boolean;
    selected: boolean;
    answerIndex: number;
    questionType: models.enums.QuestionType;
    mode: EditMode | ExamAndReviewMode;
    onSelectionChange: React.ChangeEventHandler<HTMLInputElement>;
};

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
    content,
    correct,
    selected,
    answerIndex,
    questionType,
    mode,
    onSelectionChange,
}) => {
    const selectionType =
        questionType === models.enums.QuestionType.MultiChoice ? "checkbox" : "radio";
    const TagName: keyof JSX.IntrinsicElements = mode.isEditMode ? "div" : "label";
    return (
        <TagName className={`question__answer ${mode.isEditMode ? "edit-mode" : "exam-mode"}`}>
            <div className="question__answer-selection">
                <input type={selectionType} checked={selected} onChange={onSelectionChange} />
                {mode.isEditMode && (
                    <Icon
                        icon="close"
                        color="#969696"
                        size={22}
                        onClick={mode.onAnswerRemove}
                    />
                )}
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
                        <p className={(mode.isReview && (mode.highlighted ?? correct)) ? "correct" : ""}>{content}</p>
                    )}
            </div>
        </TagName>
    );
};

export default QuestionAnswer;
