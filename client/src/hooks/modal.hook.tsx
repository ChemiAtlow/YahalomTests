import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Backdrop } from "../components";

type ModalContextFn = {
    modalInstances: Modal<any>[];
    openModal: <T extends ModalInstance>(
        Component: React.FC<T>,
        props: Omit<T, "close">
    ) => Modal<T>;
    hasOpenModals: () => boolean;
};
export interface ModalInstance<T extends {} = any> {
    close: (value?: T) => void;
}
type closeModal<T extends ModalInstance> = Parameters<T["close"]>[0];

export class Modal<T extends ModalInstance> {
    public promise: Promise<closeModal<T>>;
    public resolve!: (value: closeModal<T>) => void;

    constructor(
        public Component: React.FC<T>,
        public props: Omit<T, "close">,
        public closeCB: (modal: Modal<T>, value: closeModal<T>) => void
    ) {
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }
    close(value: closeModal<T>) {
        this.closeCB(this, value);
    }
}

const ModalContext = createContext<ModalContextFn>({
    modalInstances: [],
    hasOpenModals: () => false,
    openModal: () => ({} as any),
});

export function ModalProvider({ children }: React.PropsWithChildren<any>) {
    const value = useModalProvider();
    return (
        <ModalContext.Provider value={value}>
            {children}
            {value.modalInstances.length && <Backdrop />}
            {value.modalInstances.map(modal =>
                createPortal(
                    <modal.Component close={modal.close.bind(modal)} {...modal.props} />,
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
    const [modalInstances, setModalInstances] = useState<Modal<any>[]>([]);
    const openModal = <T extends ModalInstance>(
        Component: React.FC<T>,
        props: Omit<T, "close"> = {} as any
    ) => {
        const modal = new Modal<T>(Component, props, (m,v) =>closeModal(m,v));
        setModalInstances([...modalInstances, modal]);
        return modal;
    };

    const closeModal = useCallback(
        <V extends {}, T extends ModalInstance<V>>(modal: Modal<T>, value: V) => {
            console.log(modalInstances, modal);
            modal.resolve(value);
            const index = modalInstances.indexOf(modal);
            if (index !== -1) {
                setModalInstances([...modalInstances.splice(index, 1)]);
            }
        },
        [modalInstances, setModalInstances]
    );

    const hasOpenModals = () => modalInstances.length > 0;
    return {
        modalInstances,
        hasOpenModals,
        openModal,
    };
}
