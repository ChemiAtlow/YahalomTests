import React from "react";
import {
    Accordion,
    AccordionSection,
    Column,
    Container,
    DataTable,
    FormField,
} from '../../../components';
import { EmailForm } from "./EmailForm";
import type { TestMessagesError, TestMessagesKeys } from './types';

const columns: Column[] = [
    {
        label: 'Template',
        key: 'key',
        sortable: true,
    },
    {
        label: 'Value',
        key: 'value',
        sortable: true,
        largeColumn: true,
    },
];
const emailTemplates = [
    { key: '@TestName@', value: 'The name of the test.' },
    { key: '@FirstName@', value: 'First name of student who took the exam.' },
    { key: '@LastName@', value: 'Last name of student who took the exam.' },
    { key: '@Date@', value: 'Date of exam completion.' },
    { key: '@Grade@', value: 'The grade the student has gotten.' },
    {
        key: '@Certificate@',
        value: 'A link to the course certificate - will work only for students who passed.',
    },
];

interface TestEmailsProps {
    test: TestMessagesKeys;
    errors: Omit<TestMessagesError, "general">;
    onChange: (change: Partial<TestMessagesKeys>) => void;
}

export const TestMessages: React.FC<TestEmailsProps> = ({
    test,
    onChange,
    errors,
}) => {

    const genericChange = <K extends keyof TestMessagesKeys, V extends TestMessagesKeys[K]>(key: K, value: Partial<V>) => {
        onChange({ [key]: value })
    }

    return (
        <Container>
            <br />
            <Accordion>
                <AccordionSection title="After test messages">
                    <FormField
                        label="Success message"
                        type="textarea"
                        required
                        value={test.successMessage}
                        onChange={({target}) => genericChange("successMessage", target.value)}
                        error={errors.successMessage}
                    />
                    <FormField
                        label="Failure message"
                        type="textarea"
                        required
                        value={test.failureMessage}
                        onChange={({target}) => genericChange("failureMessage", target.value)}
                        error={errors.failureMessage}
                    />
                </AccordionSection>
                <AccordionSection title="Success Email">
                    <EmailForm
                        email={test.successEmail}
                        onChange={change => genericChange("successEmail", change)}
                        errors={errors.successEmail}
                        />
                </AccordionSection>
                <AccordionSection title="Failure Email">
                    <EmailForm
                        email={test.failureEmail}
                        onChange={change => genericChange("failureEmail", change)}
                        errors={errors.failureEmail}
                    />
                </AccordionSection>
                <AccordionSection title="Email messages wildcards">
                    <DataTable columns={columns} data={emailTemplates} stickAtTop />
                </AccordionSection>
            </Accordion>
        </Container>
    );
};
