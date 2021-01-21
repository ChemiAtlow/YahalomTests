import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../../hooks";
import "./Modal.scoped.scss";

interface ModalProps {
    key?: string;
    allowCloseOnClickOutside?: boolean;
    title?: React.ReactNode;
    actions?: React.ReactNode;
    visible: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
    title,
    actions,
    children,
    key,
    allowCloseOnClickOutside = true,
    onClose,
    visible,
}) => {
    const dialog = useRef<HTMLDivElement>(null);
    useClickOutside<HTMLDivElement>({
        callback: onClose,
        activate: allowCloseOnClickOutside,
        ignoredElements: [dialog],
    });
    return (
        <div>
            {visible && createPortal(<div className="modal-backdrop" />, document.body)}
            {visible &&
                createPortal(
                    <div ref={dialog} className="modal">
                        <header className="modal-header">
                            <div className="modal-header__title">{title}</div>
                            <div className="modal-header__close" onClick={onClose}>
                                &times;
                                {/* Use Icon from different branch. this is like a machine time! */}
                            </div>
                        </header>
                        <main className="modal-body">{children}</main>
                        {actions && <footer className="modal-actions">{actions}</footer>}
                    </div>,
                    document.body,
                    key
                )}
        </div>
    );
};

export default Modal;
