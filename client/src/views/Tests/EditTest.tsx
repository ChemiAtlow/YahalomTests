import { models } from '@yahalom-tests/common';
import React, { useState } from 'react'
import { SectionNavigator, Section } from '../../components'
import { TestDetails, TestEmails, TestQuestions } from "./TestForm";

const EditTest: React.FC = () => {
    const [test, setTest] = useState<models.dtos.TestDto>({
        title: "",
        intro: "",
        questions: [],
        language: models.enums.Language.Hebrew,
        teacherEmail: "",
        minPassGrade: 55,
        isReviewEnabled: true,
        successMessage: "",
        failureMessage: "",
        successEmail: { body: "", subject: "" },
        failureEmail: { body: "", subject: "" },
    });
    //#region test details callbacks
    const detailsValidityChanged = () => { };
    const onDetailsChange = (changed: Partial<models.dtos.TestDto>) => { };
    //#endregion

    //#region test questions callbacks
    const onQuestionsChange = (changed: Partial<models.dtos.TestDto>) => {
        setTest({ ...test, ...changed });
        console.log(test.questions); //temporary - verify test contains the questions.
    };
    const questionsValidityChange = () => { };
    //#endregion

    //#region test emails callbacks
    const emailsValidityChanged = () => { };
    const onEmailsChange = (changed: Partial<models.dtos.TestDto>) => { };
    //#endregion

    return (
        <form>
            <SectionNavigator>
                <Section label="Test Details">
                    <TestDetails test={test} onChange={e => onDetailsChange(e)} onValidityChange={detailsValidityChanged} />
                </Section>
                <Section label="Test Complition">
                    <TestEmails test={test} onChange={e => onEmailsChange(e)} onValidityChange={emailsValidityChanged} />
                </Section>
                <Section label="Test Questions">
                    <TestQuestions test={test} onChange={e => onQuestionsChange(e)} onValidityChange={questionsValidityChange} />
                </Section>
            </SectionNavigator>
        </form>
    )
}

export default EditTest
