import React, { useState } from "react";
import { SectionProps } from "./Section";
import "./SectionNavigator.scoped.scss";

interface SectionNavigatorProps {
    children: React.ReactElement<SectionProps>[];
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({ children }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="section">
            <div className="section-links">
                {children.map((s, i) => (
                    <span
                        key={i}
                        className={`section-links__item ${current === i ? "active" : ""}`}
                        onClick={() => setCurrent(i)}>
                        {s.props.label}
                    </span>
                ))}
            </div>
            <section className="section-content">{children[current]}</section>
        </div>
    );
};
