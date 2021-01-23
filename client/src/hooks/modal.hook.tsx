import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Backdrop } from "../components";

type ModalContextFn = {
    modalInstances: ModalWrapper<any>[];
    openModal: <T extends ModalInstance>(
        Component: React.FC<T>,
        props: Omit<T, "close">
    ) => ModalWrapper<T>;
    closeModal: <V extends {}, T extends ModalInstance<V>>(modal: ModalWrapper<T>, value: V) => void;
    closeLastModal: () => void;
    hasOpenModals: () => boolean;
};
export interface ModalInstance<T extends {} = any> {
    close: (value?: T) => void;
}
type closeModal<T extends ModalInstance> = Parameters<T["close"]>[0];

export class ModalWrapper<T extends ModalInstance> {
    public promise: Promise<closeModal<T>>;
    public resolve!: (value: closeModal<T>) => void;

    constructor(public Component: React.FC<T>, public props: Omit<T, "close">) {
        this.promise = new Promise(res => {
            this.resolve = res;
        });
    }
}

const ModalContext = createContext<ModalContextFn>({
    modalInstances: [],
    hasOpenModals: () => false,
    openModal: () => ({} as any),
    closeModal: () => undefined,
    closeLastModal: () => {}
});

export function ModalProvider({ children }: React.PropsWithChildren<any>) {
    const value = useModalProvider();
    return (
        <ModalContext.Provider value={value}>
            {children}
            {value.modalInstances.length && <Backdrop onEscape={() => value.closeLastModal()} />}
            {value.modalInstances.map(modal =>
                createPortal(
                    <modal.Component
                        close={(val: any) => value.closeModal(modal, val)}
                        {...modal.props}
                    />,
                    document.body
                )
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    return useContext(ModalContext);
};

function useModalProvider(): ModalContextFn {
    const [modalInstances, setModalInstances] = useState<ModalWrapper<any>[]>([]);
    const openModal = <T extends ModalInstance>(
        Component: React.FC<T>,
        props: Omit<T, "close"> = {} as any
    ) => {
        const modal = new ModalWrapper<T>(Component, props);
        setModalInstances([...modalInstances, modal]);
        return modal;
    };

    const closeModal = <V extends {}, T extends ModalInstance<V>>(modal: ModalWrapper<T>, value: V) => {
        modal.resolve(value);
        setModalInstances(modalInstances.filter(m => m !== modal));
    };

    const closeLastModal = () => {
        const lastModal = modalInstances.pop();
        lastModal?.resolve(undefined);
        setModalInstances([...modalInstances]);
    }
    const hasOpenModals = () => modalInstances.length > 0;
    return {
        modalInstances,
        hasOpenModals,
        closeLastModal,
        closeModal,
        openModal,
    };
}
