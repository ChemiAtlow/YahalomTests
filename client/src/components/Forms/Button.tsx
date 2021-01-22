import React from "react";
import "./Button.scoped.scss";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	 color?: 'olive' | 'orange' | 'pink' | 'white' | 'gray';
    varaiety?: 'small' | 'large' | 'secondary';
}

const AppButton: React.FC<AppButtonProps> = ({ children, color, varaiety, ...rest }) => {
    return (
        <button
            {...rest}
            className={`app-button ${color ? color : ""} ${varaiety ? varaiety : ""}`}>
            {children}
        </button>
    );
};

export default AppButton;
