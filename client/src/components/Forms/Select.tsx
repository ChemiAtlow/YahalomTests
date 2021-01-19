import React from "react";
import "./Select.scoped.scss";

interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
	label: string;
}

const Select: React.FC<SelectProps> = ({ label }) => {
	return (
		<div className="select">
			<select className="select-text" required>
				<option value="" disabled selected />
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
			</select>
			<span className="select-highlight" />
			<span className="select-bar" />
			<label className="select-label">{label}</label>
		</div>
	);
};

export default Select;
