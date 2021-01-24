import React from "react";
import { ModalInstance, useClickOutside } from "../../hooks";
import { AppButton } from "../Forms";
import Icon from "../Icon";
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
                <div className="modal-header__title">
                    {typeof title !== "string" ? (
                        title
                    ) : (
                        <div className="modal-header__title-wrapper">{title}</div>
                    )}
                </div>
                <div className="modal-header__close" onClick={() => close(false)}>
                    <Icon icon="close" />
                </div>
            </header>
            <main className="modal-body">{children}</main>
            {(okText || cancelText) && (
                <footer className="modal-actions">
                    {okText && (
                        <AppButton
                            onClick={() => {
                                close(true);
                            }}>
                            {okText}
                        </AppButton>
                    )}
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
