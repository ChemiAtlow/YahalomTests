import React, { useState } from "react";
import Icon from "../Icon";
import { Tooltip } from "../Tooltip";
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
                {children.map((s, i) => {
                    const isSectionInvalid =
                        typeof s.props.isValid !== "boolean" ? false : !s.props.isValid;
                    return (
                        <Tooltip
                            key={i}
                            attachToChild={true}
                            direction="bottom"
                            value={isSectionInvalid ? "Section has errors,\nplease check it out." : ""}>
                            <span
                                className={`section-links__item ${current === i ? "active" : ""}`}
                                onClick={() => setCurrent(i)}>
                                {s.props.label}
                                {isSectionInvalid && (
                                    <div className="section-links__item-error">
                                        <Icon icon="error" color="#ac0f1d" />
                                    </div>
                                )}
                            </span>
                        </Tooltip>
                    );
                })}
            </div>
            <section className="section-content">{children[current]}</section>
        </div>
    );
};
