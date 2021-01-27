import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom';
import { SectionNavigator, Section, AppButton, ErrorModal, MessageModal, FixedFooter } from '../../components'
import { useAuth, useModal } from '../../hooks';
import { testService } from '../../services';
import { TestDetails, TestEmails, TestQuestions } from "./TestForm";

interface EditTestProps {
    onTestAddedOrEdited: (test: models.interfaces.Test) => void;
}
interface EditParams {
    testId?: models.classes.guid;
}

const EditTest: React.FC<EditTestProps> = ({ onTestAddedOrEdited }) => {
    const [test, setTest] = useState<models.dtos.TestDto>({
        title: "",
        intro: "",
        questions: [],
        language: models.enums.Language.Hebrew,
        minPassGrade: 55,
        isReviewEnabled: true,
        successMessage: "",
        failureMessage: "",
        successEmail: { body: "", subject: "" },
        failureEmail: { body: "", subject: "" },
    });
    const { openModal } = useModal();
    const { buildAuthRequestData } = useAuth();
    const [detailsError, setDetailsError] = useState("");
    const [emailsError, setEmailsError] = useState("");
    const [questionsError, setQuestionsError] = useState("");
    const { params } = useRouteMatch<EditParams>();
    const { state } = useLocation<{ test?: models.dtos.TestDto }>();
    const isInvalid =
        //check for errors from components
        Boolean(emailsError) || Boolean(questionsError) || Boolean(detailsError) ||
        //check validate in case the user didn't write and make a errorChange.
        !Boolean(test.title)
        || !Boolean(test.successMessage)
        || !Boolean(test.successEmail) || !Boolean(test.questions?.length > 0) || !Boolean(test.minPassGrade)
        || !Boolean(test.intro) || !Boolean(test.failureMessage) || !Boolean(test.failureEmail);

    const onChange = (changed: Partial<models.dtos.TestDto>) => {
        setTest({ ...test, ...changed });
        console.log({ ...test, ...changed });
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isInvalid) {
            return;
        }
        try {
            const testToSend = buildTestForSend();
            const authData = buildAuthRequestData();
            let savedTest: models.interfaces.Test;
            if (testToSend.id) { //check weather add test or edit
                const { data } = await testService.editTest(authData, testToSend.id, testToSend);
                savedTest = data;
            } else {
                const { data } = await testService.addTest(authData, testToSend);
                savedTest = data;
            }
            openModal(MessageModal, { title: "Success!", children: `Test ${testToSend.id ? "edited" : "created"} successfully.`, okText: "OK" })
            onTestAddedOrEdited(savedTest)
        } catch (err) {
            openModal(ErrorModal, { title: "Saving question failed", body: err.message });
        }
    };
    const buildTestForSend = () => {
        const { title, intro, successMessage, failureMessage,
            successEmail: { body: successBody, subject: successSubject },
            failureEmail: { body: failureBody, subject: failureSubject } } = test;
        const testClone: models.dtos.TestDto = {
            ...test,
            successMessage: successMessage.trim(),
            failureMessage: failureMessage.trim(),
            title: title.trim(),
            intro: intro.trim(),
            successEmail: { body: successBody.trim(), subject: successSubject.trim() },
            failureEmail: { body: failureBody.trim(), subject: failureSubject.trim() }
        };
        return testClone;
    };

    useEffect(() => {
        if (params.testId && state?.test) {
            setTest(state.test);
        } else if (params.testId && !state?.test) {
            testService.getTest(buildAuthRequestData(), params.testId)
                .then(({ data }) => setTest(data))
                .catch(err => openModal(ErrorModal, {
                    title: "Error loading test",
                    body: `An error occoured while loading the test for editing:\n${err?.message || ""}`
                }))
        }
    }, [state, params, setTest, buildAuthRequestData, openModal]);

    return (
        <FixedFooter>
        <form onSubmit={onSubmit} >
            <SectionNavigator>
                <Section label="Test Details" errMsg={detailsError} isValid={!detailsError}>
                    <TestDetails test={test} onChange={onChange} onValidityChange={setDetailsError} />
                </Section>
                <Section label="Test Complition" errMsg={emailsError} isValid={!emailsError}>
                    <TestEmails test={test} onChange={onChange} onValidityChange={setEmailsError} />
                </Section>
                <Section label="Test Questions" errMsg={questionsError} isValid={!questionsError}>
                    <TestQuestions test={test} onChange={onChange} onValidityChange={setQuestionsError} />
                </Section>
            </SectionNavigator>
            </form>
            <div>
                <AppButton disabled={isInvalid} type="submit" form="edit-question__form">
                    {test.id ? "Edit" : "Create"}
                </AppButton>
            </div>
        </FixedFooter>
    )
}

export default EditTest
