import React, { useState } from 'react';
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';

interface EmailFormProps {
    email: models.dtos.EmailDto;
    onChange: React.ChangeEventHandler<models.dtos.EmailDto>;
}

export const EmailForm: React.FC<EmailFormProps> = ({ email, onChange }) => {
    const onSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //will call to onCHange callback};
    };
    const onBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => { };

    return (
        <>
            <FormField label="Mail subject"
                type="text"
                required
                value={email?.subject}
                onChange={onSubjectChange}
            />
            <FormField label="Mail body"
                type="text"
                required
                value={email?.body}
                onChange={onBodyChange}
            />
        </>
    )
}
