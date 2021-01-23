import React from "react";
import { ModalInstance, useClickOutside } from "../../hooks";
import { AppButton } from "../Forms";
import "./Modal.scoped.scss";

export interface ModalProps extends ModalInstance<boolean> {
    title?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
    closeOnClickOutside?: boolean;
}

export const BaseModal: React.FC<ModalProps> = ({
    title,
    children,
    close,
    closeOnClickOutside = true,
    cancelText,
    okText,
}) => {
    const dialogRef = useClickOutside<HTMLDivElement>({
        callback: () => close(false),
        activate: closeOnClickOutside,
    });
    return (
        <div ref={dialogRef} className="modal">
            <header className="modal-header">
                <div className="modal-header__title">{title}</div>
                {/* Use Icon from different branch. this is like a machine time! */}
                {/* <Icon onClick={() => props.closeModal()} icon='close' className="modal-header__close" /> */}
                <div className="modal-header__close" onClick={() => close(false)}>
                    &times;
                </div>
            </header>
            <main className="modal-body">{children}</main>
            {(okText || cancelText) && (
                <footer className="modal-actions">
                    {okText && <AppButton onClick={() => {
                        close(true);
                    }}>{okText}</AppButton>}
                    {cancelText && (
                        <AppButton varaiety="secondary" onClick={() => close(false)}>
                            {cancelText}
                        </AppButton>
                    )}
                </footer>
            )}
        </div>
    );
};
