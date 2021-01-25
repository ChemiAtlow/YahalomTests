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

    const onChange = ({ questions }: Partial<Pick<models.dtos.TestDto, "questions">>) => {
        ///questions are not undefined or empty
        if (!questions || !(questions?.length > 0)) {
            console.log("empty questions");
        } else {
            test.questions = questions!;
            setTest({ ...test });
            console.log(test.questions); //temporary - verify test contains the questions.
        }
    };
    const validityChange = () => { };

    /* prop to all - test */
    /* Test form */
    return (
        <form>
            <SectionNavigator>
                <Section label="Test Details">
                    <TestDetails {...test} />
                </Section>
                <Section label="Test Complition">
                    <TestEmails {...test} />
                </Section>
                <Section label="Test Questions">
                    <TestQuestions test={test} onChange={e => onChange(e)} onValidityChange={validityChange} />
                </Section>
            </SectionNavigator>
        </form>
    )
}

export default EditTest
