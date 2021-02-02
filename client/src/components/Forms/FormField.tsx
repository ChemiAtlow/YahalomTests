import React from 'react';
import './FormField.scoped.scss';
import Icon from '../Icon';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    type: 'text' | 'password' | 'number' | 'textarea';
    label: string;
    error?: string;
    blockErrors?: boolean;
    search?: boolean;
}
const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    type,
    required,
    blockErrors,
    search,
    ...rest
}) => {
    return (
        <div
            className={`form-field ${error && !blockErrors ? 'error' : ''} ${
                search ? 'search' : ''
            }`}>
            <label className="form-field__control">
                {type === 'textarea' ? (
                    <textarea
                        className="form-field__control-input"
                        placeholder=" "
                        required
                        {...rest}
                    />
                ) : (
                    <input
                        className="form-field__control-input"
                        placeholder=" "
                        required
                        type={type}
                        {...rest}
                    />
                )}
                <span className="form-field__control-label">{`${label}${
                    required ? '*' : ''
                }`}</span>
                <div className="form-field__control-bar" />
                {search && (
                    <div className="form-field__control-icon">
                        <Icon icon="search" />
                    </div>
                )}
            </label>
            {!blockErrors && <p className="form-field__error">{error}</p>}
        </div>
    );
};

export default FormField;
