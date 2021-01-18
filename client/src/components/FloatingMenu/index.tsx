import React, { useRef, useState } from "react";
import { useClickOutside } from "../../hooks";
import "./FloatingMenu.scpoped.scss";

interface FloatingMenuProps {
	children: React.ReactNode[];
	trigger: React.ReactNode;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ children, trigger }) => {
	const menuRef = useRef(null);
	const [isActive, setIsActive] = useState(false);

	useClickOutside<HTMLDivElement>({
		callback: () => setIsActive(false),
		activate: isActive,
		ignoredElements: [menuRef],
		eventListenerOptions: false,
	});
	const onClick = () => setIsActive(!isActive);
	return (
		<div className="menu-container" ref={menuRef}>
			<div className="trigger-container" onClick={onClick}>
				{trigger}
			</div>
			<div className={`arrow ${isActive ? "active" : "inactive"}`}>
				<nav className="menu">
					<ul>
						{children.map((el, i) => (
							<li key={i} onClick={onClick}>
								{el}
							</li>
						))}
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default FloatingMenu;
