import { useRef, useEffect, MutableRefObject } from 'react';

type useClickOutsideOptions = {
    callback: () => void;
    activate: boolean;
    events?: string[];
    eventListenerOptions?: Parameters<Document['addEventListener']>[2];
    onlyOnce?: boolean;
    ignoredElements?: MutableRefObject<any>[],
}
const DEFAULT_EVENTS = ['click'];
const DEFAULT_IGNORED_ELEMENTS: MutableRefObject<any>[] = [];


export function useClickOutside<T extends HTMLElement>({
    callback, activate, events = DEFAULT_EVENTS, eventListenerOptions = true, onlyOnce = true, ignoredElements = DEFAULT_IGNORED_ELEMENTS,
}: useClickOutsideOptions): MutableRefObject<T | null> {
    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        const onClickOutside = (event: Event) => {
            const eventInIgnoredElement = [...ignoredElements, elementRef].some(element => element.current?.contains(event.target as Element));
            if (eventInIgnoredElement) {
                return;
            }
            if (onlyOnce) {
                removeBodyEventListener();
            }
            callback();
        };

        function removeBodyEventListener() {
            events.forEach(e => document.removeEventListener(e, onClickOutside, eventListenerOptions));
        }

        if (activate) {
            events.forEach(e => document.addEventListener(e, onClickOutside, eventListenerOptions));
        } else {
            removeBodyEventListener();
        }
        return () => removeBodyEventListener();
    }, [activate, events, callback, eventListenerOptions, onlyOnce, ignoredElements]);

    return elementRef;
}