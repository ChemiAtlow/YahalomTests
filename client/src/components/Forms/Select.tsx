import React from "react";
import "./Select.scoped.scss";

interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: { label: string; value?: string }[];
}

const Select: React.FC<SelectProps> = ({
	label,
	options,
	value = "",
	...rest
}) => {
	return (
		<div className="select">
			<select className="select-text" required value={value} {...rest}>
				<option className="select-text__default" value="" disabled />
				{options.map(({ value, label }, i) => (
					<option key={i} value={value || i}>
						{label}
					</option>
				))}
			</select>
			<span className="select-highlight" />
			<span className="select-bar" />
			<label className="select-label">{label}</label>
		</div>
	);
};

export default Select;
