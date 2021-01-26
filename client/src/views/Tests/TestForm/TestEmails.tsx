import React from 'react';
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';
import { EmailForm } from "./EmailForm"

export type TestEmailsKeys = Pick<models.dtos.TestDto,
    "failureEmail" | "successEmail" | "failureMessage" | "successMessage">;

interface TestEmailsProps {
    test: TestEmailsKeys;
    onChange: (change: Partial<TestEmailsKeys>) => void;
    onValidityChange: (change: string) => void;
};

export const TestEmails: React.FC<TestEmailsProps> = ({ test, onChange, onValidityChange }) => {
    const onSuccessMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onSuccessMailChange = (e: React.ChangeEvent<models.dtos.EmailDto>) => { };
    const onFailureMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onFailureMailChange = (e: React.ChangeEvent<models.dtos.EmailDto>) => { };

    return (
        <>
            <FormField label="Seccess message"
                type="textarea"
                required
                value={test.successMessage}
                onChange={onSuccessMessageChanged}
            />
            <EmailForm email={test.successEmail} onChange={onSuccessMailChange} />
            <FormField label="Failure message"
                type="textarea"
                required
                value={test.failureMessage}
                onChange={onFailureMessageChanged}
            />
            <EmailForm email={test.successEmail} onChange={onFailureMailChange} />
        </>
    )
}

