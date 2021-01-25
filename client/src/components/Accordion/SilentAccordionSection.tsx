import React, { useState, useRef, useEffect } from "react";
import Icon from "../Icon";
import "./SilentAccordionSection.scoped.scss";

interface SilentAccordionSectionProps {
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onSectionToggle: () => void;
}

export const SilentAccordionSection: React.FC<SilentAccordionSectionProps> = ({
    title,
    children,
    isActive,
    onSectionToggle,
}) => {
    const [height, setHeight] = useState("0px");
    const content = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setHeight(!isActive ? "0px" : `${content.current?.scrollHeight || 0}px`);
    }, [isActive, setHeight]);

    return (
        <div className="accordion__section">
            <div
                className={`accordion__section-header ${isActive ? "active" : ""}`}
                onClick={onSectionToggle}>
                <span className="accordion__section-header__title">{title}</span>
                <span className="accordion__section-header__icon">
                    <Icon icon="arrow" />
                </span>
            </div>
            <div ref={content} style={{ maxHeight: height }} className="accordion__section-content">
                {children}
            </div>
        </div>
    );
};
