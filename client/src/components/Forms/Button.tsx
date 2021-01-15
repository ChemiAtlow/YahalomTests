import React from "react";
import "./Button.scoped.scss";

const AppButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
	children,
	...rest
}) => {
	return (
		<button {...rest} className="app-button">
			{children}
		</button>
	);
};

export default AppButton;
