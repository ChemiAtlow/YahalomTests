import React from "react";
import { ICONS } from "./icons";
import "./Icon.scoped.scss";

interface IconProps {
    icon: keyof typeof ICONS;
    size?: number;
    color?: React.StyleHTMLAttributes<HTMLElement>["color"];
    onClick?: React.MouseEventHandler<SVGElement>;
}

const Icon: React.FC<IconProps> = ({ icon, color = "black", size = 16, onClick }) => (
    <svg
        className={`icon ${onClick ? "clickable" : ""}`}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 1024 1024"
        onClick={onClick}>
        <path fill={color} d={ICONS[icon]} />
    </svg>
);

export default Icon;
