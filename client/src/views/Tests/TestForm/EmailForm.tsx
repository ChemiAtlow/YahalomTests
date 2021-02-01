import React from 'react';
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';
import type { TestEmailError } from './types';

interface EmailFormProps {
    email: models.dtos.EmailDto;
    errors: TestEmailError;
    onChange: (change: Partial<models.dtos.EmailDto>) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ email, onChange, errors }) => {
    const genericChange = <K extends keyof models.dtos.EmailDto, V extends models.dtos.EmailDto[K]>(key: K, value: V) => {
        onChange({ [key]: value })
    }

    return (
        <>
            <FormField label="Mail subject"
                type="text"
                required
                value={email?.subject}
                onChange={({target}) => genericChange("subject", target.value)}
                error={errors.subject}
            />
            <FormField label="Mail body"
                type="textarea"
                required
                value={email?.body}
                onChange={({target}) => genericChange("body", target.value)}
                error={errors.body}
            />
        </>
    )
}
