import React, { useState } from "react";

enum WindowRegion {
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
}

function windowRegion(mouseX: number, mouseY: number) {
	const halfHeight = window.window.innerHeight * 0.5;
	if (mouseX <= window.window.innerWidth * 0.5) {
		return mouseY <= halfHeight
			? WindowRegion.TopLeft
			: WindowRegion.BottomLeft;
	}
	return mouseY <= halfHeight
		? WindowRegion.TopRight
		: WindowRegion.BottomRight;
}

export interface TooltipProps {
	content: string | JSX.Element;
	tooltipClassName?: string;
	offsetLeft?: number;
	offsetRight?: number;
	offsetTop?: number;
	offsetBottom?: number;
}

export interface TooltipState {
	x: number;
	y: number;
	wndRegion: WindowRegion;
	hidden: boolean;
	ttClassName: string;
	offsetLeft: number;
	offsetRight: number;
	offsetTop: number;
	offsetBottom: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, tooltipClassName, ...offsets }) => {
    const [state, setState] = useState<TooltipState>({
        x: 0,
        y:0,
        wndRegion: WindowRegion.TopLeft,
        hidden: true,
        ttClassName: tooltipClassName || "tooltip",
        offsetLeft: offsets.offsetLeft || 10,
        offsetTop: offsets.offsetTop || 10,
        offsetRight: offsets.offsetRight || 5,
        offsetBottom: offsets.offsetBottom || 5,
    });

	const onMouseEnter = (e: React.MouseEvent) => {
		setState({
            ...state,
			hidden: false,
			wndRegion: windowRegion(e.clientX, e.clientY),
		});
	};

	const onMouseLeave = () => {
		setState({ ...state, hidden: true });
	};
    const computeStyle: () => React.CSSProperties  = () => {
        const position = "fixed";
		switch (state.wndRegion) {
			case WindowRegion.TopLeft:
				return {
					position,
					left: `${state.x + state.offsetLeft}px`,
					top: `${state.y + state.offsetTop}px`,
				};
			case WindowRegion.TopRight:
				return {
					position,
					right: `${window.window.innerWidth -
						state.x +
						state.offsetRight}px`,
					top: `${state.y + state.offsetTop}px`,
				};
			case WindowRegion.BottomLeft:
				return {
					position,
					left: `${state.x + state.offsetLeft}px`,
					bottom: `${window.window.innerHeight -
						state.y +
						state.offsetBottom}px`,
				};
			case WindowRegion.BottomRight:
				return {
					position,
					right: `${window.window.innerWidth -
						state.x +
						state.offsetRight}px`,
					bottom: `${window.window.innerHeight -
						state.y +
						state.offsetBottom}px`,
				};
		}
	};
    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {children}
            {state?.hidden ? null : (<div className={state.ttClassName} style={computeStyle()}>{content}</div>)}
        </div>
    )
}

export default Tooltip;
