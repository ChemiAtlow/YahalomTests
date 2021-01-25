import React, { useState, Children } from "react";
import { AccordionSectionProps } from "./AccordionSection";
import { SilentAccordionSection } from "./SilentAccordionSection";

interface AccordionProps {
    children: React.ReactElement<AccordionSectionProps>[];
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
    const [active, setActive] = useState<number>();
    const onSectionToggle = (index: number) => {
        setActive(index);
        if (active === index) {
            setActive(undefined);
        }
    }

    return (
        <div className="accordion">
            {Children.map(children, (section, i) => (
                <SilentAccordionSection
                    key={i}
                    {...section.props}
                    isActive={active === i}
                    onSectionToggle={() => onSectionToggle(i)}
                />
            ))}
        </div>
    );
};
