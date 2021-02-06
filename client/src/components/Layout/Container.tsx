import React from "react";
import "./Container.scoped.scss";

interface ContainerProps {
    align?: "start" | "center" | "end";
};

const Container: React.FC<ContainerProps> = ({ children, align }) => {
    return <div className={`container ${align || ""}`}>{children}</div>;
};

export default Container;
