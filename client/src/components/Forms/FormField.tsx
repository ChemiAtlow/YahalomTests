import React from "react";
import "./FormField.scoped.scss";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    type: "text" | "password" | "number" | "textarea" | "radio" | "checkbox";
    label: string;
    error?: string;
}
const FormField: React.FC<FormFieldProps> = ({ label, error, type, required, ...rest }) => {
    return (
        <div className={`form-field ${error ? "error" : ""}`}>
            <label className="form-field__control">
                {type === "textarea" ? (
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
                    required ? "*" : ""
                }`}</span>
                <div className="form-field__control-bar" />
            </label>
            {error && <p className="form-field__error">{error}</p>}
        </div>
    );
};

export default FormField;
