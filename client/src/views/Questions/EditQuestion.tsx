import { models } from '@yahalom-tests/common';
import React, { useState } from 'react';
import { AppButton, SectionNavigator, Section, ErrorModal, QuestionPeekModal } from '../../components';
import { useAuth, useModal } from "../../hooks";
import { questionService } from '../../services';
import "./EditQuestion.scoped.scss";
import { QuestionDetails, QuestionDetailsKeys, QuestionAnswers } from './QuestionForm';

// interface EditParams {
//     questionId?: models.classes.guid;
// }
const EditQuestion: React.FC = () => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [{ content: "", correct: false }],
        label: "",
        alignment: models.enums.Alignment.Vertical,
    });
    
    const { activeStudyField, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();

    const isInvalid = false;
    // Boolean(
    //     titleError || additionalContentError || labelError ||
    //     question.answers.length < 2
    // );
    const onChange = (e: Partial<QuestionDetailsKeys>) => {
        setQuestion({ ...question, ...e });
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const questionClone = { ...question };
            const { answers } = questionClone;
            if (!answers[answers.length - 1]?.content.trim()) {
                answers.pop();
            }
            await questionService.addQuestion(buildAuthRequestData(), questionClone);
        } catch (err) {
            openModal(ErrorModal, { title: "Add question failed", body: err.message });
        }
    };


    const previewQuestion = () => {
        openModal(QuestionPeekModal, { question });
    }

    return (
        <form onSubmit={onSubmit} noValidate className="edit-question__form">
            <SectionNavigator>
                <Section label="Question Details">
                    <QuestionDetails question={question} fieldName={activeStudyField?.name || ""} onChange={onChange}  />
                </Section>
                <Section label="Question answers">
                    <QuestionAnswers question={question} onChange={onChange} />
                </Section>
            </SectionNavigator>
            <div>
                <AppButton disabled={isInvalid} type="submit" className="edit-question__form">
                    Submit
                </AppButton>
                <AppButton disabled={isInvalid} type="button" varaiety="secondary" className="edit-question__form" onClick={() => previewQuestion()}>
                    Preview
                </AppButton>
            </div>
        </form >
    )
}

export default EditQuestion
