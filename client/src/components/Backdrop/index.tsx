import React from "react";
import { createPortal } from "react-dom";
import "./Backdrop.scoped.scss";

const Backdrop: React.FC = () => {
    return createPortal(<div className="backdrop" />, document.body);
};

export default Backdrop;
