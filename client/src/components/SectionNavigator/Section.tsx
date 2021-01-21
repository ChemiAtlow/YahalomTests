import React from 'react'
export interface SectionProps {
    label: string;
}

export const Section: React.FC<SectionProps> = ({ children }) => {
    return <>{children}</>;
}
