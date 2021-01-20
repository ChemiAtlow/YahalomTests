import React, { Children, cloneElement } from "react";
import "./Row.scoped.scss";

const Row: React.FC = ({ children }) => {
    return <div className="row">{children}</div>;
};

export default Row;
