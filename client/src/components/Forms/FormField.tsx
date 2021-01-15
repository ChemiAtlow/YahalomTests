import React from "react";
import "./FormField.scoped.scss";

interface FormFieldProps {
	label: string;
	type: "text" | "password" | "number" | "textarea" | "radio" | "checkbox";
	value: string;
	onChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}
const FormField: React.FC<FormFieldProps> = ({
	label,
	type,
	value,
	onChange,
}) => {
	return (
		<div className="form-field">
			<label>
				{label}
				<input type={type} value={value} onChange={onChange} />
			</label>
		</div>
	);
};

export default FormField;
