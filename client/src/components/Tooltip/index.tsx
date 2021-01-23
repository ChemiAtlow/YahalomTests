import React, { useState, useCallback, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks/';
import './Tooltip.scoped.scss';

export type direction = 'top' |
    'top-left' |
    'top-right' |
    'bottom' |
    'bottom-left' |
    'bottom-right' |
    'right' |
    'right-top' |
    'right-bottom' |
    'left' |
    'left-top' |
    'left-bottom';

type Cloneable = Parameters<typeof React['cloneElement']>[0]

export type ITooltipProps = {
    className?: string;
    delay?: number;
    direction?: direction;
    color?: 'black' | 'white';
    value: React.ReactNode;
    trigger?: 'hover' | 'click';
    onVisibilityChanged?: (isVisible: boolean) => void;
} & ({ attachToChild?: false; wrapperClassName?: string; } | { attachToChild: true; children: Cloneable })

type Rect = { top: number, left: number, width: number, height: number };
export const rectToStyles: (rect: Rect, direction: direction) => { top: number; left: number; opacity: number } = ({
    top, left, width, height,
}, direction) => {
    switch (direction) {
        case 'right':
            return { top: top + height / 2, left: left + width, opacity: 0 };
        case 'left':
            return { top: top + height / 2, left, opacity: 0 };
        case 'bottom':
            return { top: top + height, left: left + width / 2, opacity: 0 };
        case 'left-bottom':
        case 'bottom-left':
            return { top: top + height, left, opacity: 0 };
        case 'right-bottom':
        case 'bottom-right':
            return { top: top + height, left: left + width, opacity: 0 };
        case 'left-top':
        case 'top-left':
            return { top, left, opacity: 0 };
        case 'right-top':
        case 'top-right':
            return { top, left: left + width, opacity: 0 };
        case 'top':
        default:
            return { top, left: left + width / 2, opacity: 0 };
    }
};

export const Tooltip: React.FC<ITooltipProps> = ({ delay, direction, onVisibilityChanged, value, children, ...props }) => {
    const [isVisible, setVisibility] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [style, setStyle] = useState({ top: 0, left: 0, opacity: 0 });
    const trigger = props.trigger || 'hover';
    const handleVisibilyChanged = useCallback((isVisible: boolean) => {
        setVisibility(isVisible);
        onVisibilityChanged?.(isVisible);
    }, [onVisibilityChanged, setVisibility]);

    const showTooltip = useCallback((targetBoundingRect: DOMRect) => {
        if (!value) {
            return;
        }
        const newStyle = rectToStyles(targetBoundingRect, direction ?? 'top');
        setStyle(newStyle);
        handleVisibilyChanged(true);
        setTimeoutId(setTimeout(() => {
            setStyle({ ...newStyle, opacity: 1 });
            setTimeoutId(null);
        }, delay ?? 0) as any);
    }, [setStyle, setTimeoutId, delay, direction, value, handleVisibilyChanged]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
        if (trigger === 'hover') {
            showTooltip(e.currentTarget.getBoundingClientRect());
        }
    }, [showTooltip, trigger]);


    const hideTooltip = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setStyle({ top: 0, left: 0, opacity: 0 });
        handleVisibilyChanged(false);
    }, [setStyle, handleVisibilyChanged, timeoutId]);

    const handleClick = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
        if (trigger !== 'click') {
            return;
        }
        if (isVisible) {
            hideTooltip();
        } else {
            showTooltip(e.currentTarget.getBoundingClientRect());
        }
    }, [hideTooltip, isVisible, showTooltip, trigger]);

    useClickOutside<HTMLDivElement>({ callback: hideTooltip, activate: isVisible && trigger === 'click', eventListenerOptions: false });

    const handleMouseLeave = useCallback(() => {
        if (trigger === 'hover') {
            hideTooltip();
        }
    }, [hideTooltip, trigger]);

    const tooltip = isVisible && createPortal(<div
        className={`tooltip ${props.className ?? ""} ${props.color ?? "black"} ${direction ?? "top"}`}
        style={style}>
        {value}
    </div>, document.body);

    if (props.attachToChild) {
        return <>
            {tooltip}
            { cloneElement(children as Cloneable, trigger === 'hover' ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } as any : { onClick: handleClick })}
        </>;
    }

    return <span className={props.wrapperClassName} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
        {tooltip}
        {children}
    </span>;
};