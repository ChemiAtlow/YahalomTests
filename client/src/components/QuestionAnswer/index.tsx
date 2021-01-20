import { models } from '@yahalom-tests/common';
import React from 'react'
import { FormField } from '../Forms';

type QuestionAnswerProps = {
    answer: models.interfaces.Answer;
    type: models.enums.QuestionType;
} & (ExamMode | EditMode)
type EditMode = {
    isEditMode: true;
    onContentChange: React.ChangeEventHandler<HTMLInputElement>;
    onCorrectChange: React.ChangeEventHandler<HTMLInputElement>
}
type ExamMode = {
    isEditMode?: false;
    alignment: models.interfaces.Question["alignment"];
    onExamAnswerChange: React.ChangeEventHandler<HTMLInputElement>
}
const QuestionAnswer: React.FC<QuestionAnswerProps> = ({ answer, isEditMode, type, ...props }) => {
    return (
        <div className={`question__answer ${isEditMode ? props.alignment : ""}`}>
            <input type="checkbox" />
            { isEditMode ?
                <FormField
                    label="Answer"
                    type="textarea"
                    value={answer.content}
                    onChange={props.onContentChange} /> :
                <p>{answer.content}</p>}
        </div>
    )
}

export default QuestionAnswer
