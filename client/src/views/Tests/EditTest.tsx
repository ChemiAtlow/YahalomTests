import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom';
import { SectionNavigator, Section, AppButton, ErrorModal, MessageModal, FixedFooter } from '../../components'
import { useAuth, useModal } from '../../hooks';
import { testService } from '../../services';
import { TestDetails, TestEmails, TestQuestions, TestDetailsKeys } from "./TestForm";

type TestDetailsError = Record<keyof Omit<TestDetailsKeys, "language" | "isReviewEnabled"> | "general", string>;

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
    const [detailsErrors, setDetailsErrors] = useState<TestDetailsError>({
        general: "",
        intro: "",
        minPassGrade: "",
        title: ""
    });
    const [emailsError, setEmailsError] = useState("");
    const [questionsError, setQuestionsError] = useState("");
    const { params } = useRouteMatch<EditParams>();
    const { state } = useLocation<{ test?: models.dtos.TestDto }>();
    const isInvalid =
        //check for errors from components
        Boolean(emailsError) || Boolean(questionsError) || Boolean(detailsErrors.general) ||
        //check validate in case the user didn't write and make a errorChange.
        !Boolean(test.title)
        || !Boolean(test.successMessage)
        || !Boolean(test.successEmail) || !Boolean(test.questions?.length > 0) || !Boolean(test.minPassGrade)
        || !Boolean(test.intro) || !Boolean(test.failureMessage) || !Boolean(test.failureEmail);

    const onChange = (changed: Partial<models.dtos.TestDto>) => {
        setTest({ ...test, ...changed });
    };
    const onChangeDetails = (changed: Partial<TestDetailsKeys>) => {
        if (changed.title !== undefined) {
            const title = changed.title.trim() ? "" : "Title is required!";
            setDetailsErrors({ ...detailsErrors, title });
        }
        if (changed.intro !== undefined) {
            const intro = changed.intro.trim() ? "" : "Intro is required!";
            setDetailsErrors({ ...detailsErrors, intro });
        }
        if (changed.minPassGrade !== undefined) {
            const minPassGrade = changed.minPassGrade < 1 ? "Minimal passing grade is 1!" : 
                changed.minPassGrade >= 100 ? "Minimal passing grade can't be 100 or more!" : "";
            setDetailsErrors({ ...detailsErrors, minPassGrade });
        }
        onChange(changed);
    }
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
        const showDetailsErorr = !test.title.trim() || !test.intro.trim() || test.minPassGrade < 1 || test.minPassGrade > 100;
        const detailsError = showDetailsErorr ? "There are missing details in the form!" : "";
        setDetailsErrors(detailsErrors => ({ ...detailsErrors, general: detailsError }));
        const showQuestionsError = test.questions.length <= 0;
        setQuestionsError(showQuestionsError ? "Please select at least one question!" : "");
    }, [setQuestionsError, test])

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
        <form onSubmit={onSubmit} noValidate id="edit-test__form">
            <SectionNavigator>
                <Section label="Test Details" errMsg={detailsErrors.general} isValid={!detailsErrors.general}>
                    <TestDetails test={test} onChange={onChangeDetails} gradeError={detailsErrors.minPassGrade} introError={detailsErrors.intro} titleError={detailsErrors.title} />
                </Section>
                <Section label="Completion messages" errMsg={emailsError} isValid={!emailsError}>
                    <TestEmails test={test} onChange={onChange} onValidityChange={setEmailsError} />
                </Section>
                <Section label="Test Questions" errMsg={questionsError} isValid={!questionsError}>
                    <TestQuestions test={test} onChange={onChange} />
                </Section>
            </SectionNavigator>
            </form>
            <div>
                <AppButton disabled={isInvalid} type="submit" form="edit-test__form">
                    {test.id ? "Edit" : "Create"}
                </AppButton>
            </div>
        </FixedFooter>
    )
}

export default EditTest
