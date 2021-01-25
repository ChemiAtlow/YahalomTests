import React from 'react'
export interface SectionProps {
    label: string;
    isValid?: boolean;
}

export const Section: React.FC<SectionProps> = ({ children }) => {
    return <>{children}</>;
}
