import React from 'react'
export interface SectionProps {
    label: string;
    isValid?: boolean;
    errMsg?: string;
}

export const Section: React.FC<SectionProps> = ({ children }) => {
    return <>{children}</>;
}
