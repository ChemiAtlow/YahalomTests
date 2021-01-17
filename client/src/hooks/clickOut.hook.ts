import {
	useState,
	useEffect,
	MutableRefObject,
	Dispatch,
	SetStateAction,
} from "react";

type DetectOutsideClickHook = [boolean, Dispatch<SetStateAction<boolean>>];
type DetectOutsideClickHookFn = (
	el: MutableRefObject<any>,
	initialState: boolean
) => DetectOutsideClickHook;

export const useDetectOutsideClick: DetectOutsideClickHookFn = (
	el,
	initialState
) => {
	const [isActive, setIsActive] = useState(initialState);

	useEffect(() => {
		const pageClickEvent = (e: MouseEvent) => {
			// If the active element exists and is clicked outside of
			if (el.current !== null && !el.current.contains(e.target)) {
				setIsActive(!isActive);
			}
		};

		// If the item is active (ie open) then listen for clicks
		if (isActive) {
			window.addEventListener("click", pageClickEvent);
		}

		return () => {
			window.removeEventListener("click", pageClickEvent);
		};
	}, [isActive, el]);

	return [isActive, setIsActive];
};
