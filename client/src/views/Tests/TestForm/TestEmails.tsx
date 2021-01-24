import React, { useState } from 'react';
import { useAuth } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';
import { EmailForm } from "./EmailForm"

export const TestEmails: React.FC<models.dtos.TestDto> = (testProp) => {
    const { activeStudyField, buildAuthRequestData } = useAuth();
    //set test prop as component state.
    const [test, setTest] = useState<models.dtos.TestDto>({ ...testProp });

    const onSuccessMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onSuccessMailChange = (e: React.ChangeEvent<models.dtos.EmailDto>) => { };
    const onFailureMessageChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onFailureMailChange = (e: React.ChangeEvent<models.dtos.EmailDto>) => { };
    return (
        <div>
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
        </div >
    )
}

