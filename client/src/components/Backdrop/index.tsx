import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Backdrop.scoped.scss";

const Backdrop: React.FC<{ onEscape?: () => void }> = ({onEscape}) => {
    useEffect(() => {
        if (onEscape) {
            const listener = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    onEscape!();
                }
            };
            document.addEventListener("keydown", listener, { capture: true });
            return () => document.removeEventListener("keydown", listener, { capture: true });
        }
        return undefined;
    }, [onEscape]);
    return createPortal(<div className="backdrop" />, document.body);
};

export default Backdrop;
