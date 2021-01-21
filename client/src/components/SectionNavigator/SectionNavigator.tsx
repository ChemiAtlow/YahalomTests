import React, { useState } from 'react'
import { SectionProps } from './Section'

interface SectionNavigatorProps {
    children: React.ReactElement<SectionProps>[];
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({ children }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div>
            <div className="section-links">
                {children.map((s, i) =>
                    <span key={i} onClick={() => setCurrent(i)}>{s.props.label}</span>
                )}
            </div>
            <section className="section-content">
                {children[current]}
            </section>
        </div>
    )
}
