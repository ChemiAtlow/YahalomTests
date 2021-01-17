import React from "react";
import "./FormField.scoped.scss";

interface FormFieldProps {
	label: string;
	type: "text" | "password" | "number" | "textarea" | "radio" | "checkbox";
	value: string;
	error: string;
	onChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}
const FormField: React.FC<FormFieldProps> = ({ label, error, ...rest }) => {
	return (
		<div className="form-field">
			<label>
				{label}
				<input {...rest} />
				{error && <span>{error}</span>}
			</label>
		</div>
	);
};

export default FormField;
