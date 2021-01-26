import { models } from '@yahalom-tests/common';
import React, { useState } from 'react'
import { SectionNavigator, Section, AppButton } from '../../components'
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

    const [detailsError, setDetailsError] = useState("");
    const [emailsError, setEmailsError] = useState("");
    const [questionsError, setQuestionsError] = useState("");
    const isInvalid = Boolean(emailsError) || Boolean(questionsError) || Boolean(detailsError);

    const detailsValidityChanged = () => { };
    const onChange = (changed: Partial<models.dtos.TestDto>) => {
        console.log(test);
        setTest({ ...test, ...changed });
    };

    const questionsValidityChange = () => { };

    const emailsValidityChanged = () => { };

    return (
        <form>
            <SectionNavigator>
                <Section label="Test Details" errMsg={detailsError}>
                    <TestDetails test={test} onChange={e => onChange(e)} onValidityChange={detailsValidityChanged} />
                </Section>
                <Section label="Test Complition" errMsg={emailsError}>
                    <TestEmails test={test} onChange={e => onChange(e)} onValidityChange={emailsValidityChanged} />
                </Section>
                <Section label="Test Questions" errMsg={questionsError}>
                    <TestQuestions test={test} onChange={e => onChange(e)} onValidityChange={questionsValidityChange} />
                </Section>
            </SectionNavigator>
            <AppButton disabled={!isInvalid} type="submit" className="edit-question__form">
                {test.id ? "Edit" : "Create"}
            </AppButton>
        </form>
    )
}

export default EditTest
