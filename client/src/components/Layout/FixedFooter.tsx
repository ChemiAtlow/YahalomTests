import React from "react";
import "./FixedFooter.scoped.scss";


const FixedFooter: React.FC = ({ children }) => {
    return <div className="fixed-footer">{children}</div>;
};

export default FixedFooter;
