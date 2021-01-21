import React from "react";
import { createPortal } from "react-dom";
import "./Modal.scoped.scss";

interface ModalProps {
    key?: string;
    title?: React.ReactNode;
    actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, actions, children, key }) => {
    return (
        <div>
            {createPortal(<div className="modal-backdrop" />, document.body)}
            {createPortal(
                <div className="modal">
                    <header className="modal-header">
                        <div className="modal-header__title">{title}</div>
                        <div className="modal-header__close">
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
