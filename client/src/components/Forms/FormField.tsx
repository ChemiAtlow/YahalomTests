import React from "react";
import "./FormField.scoped.scss";

interface FromFieldProps {
	label: string;
	type: "text" | "password" | "number" | "textarea" | "radio" | "checkbox";
}
const FormField: React.FC<FromFieldProps> = ({ label, type }) => {
	return (
		<div className="form-field">
			<label>
				{label}
				<input type={type} />
			</label>
		</div>
	);
};

export default FormField;
