import React from "react";
import { ICONS } from "./icons";

interface IconProps {
    icon: keyof typeof ICONS;
    size?: number;
    color?: React.StyleHTMLAttributes<HTMLElement>["color"];
}

const Icon: React.FC<IconProps> = ({ icon, color = "black", size = 16 }) => (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 1024 1024">
        <path fill={color} d={ICONS[icon]} />
    </svg>
);

export default Icon;
