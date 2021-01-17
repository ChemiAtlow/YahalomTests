import React, { useRef } from "react";
import { useDetectOutsideClick } from "../../hooks/clickOut.hook";
import "./FloatingMenu.scpoped.scss";

interface FloatingMenuProps {
	children: React.ReactNode[];
	trigger: React.ReactNode;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ children, trigger }) => {
	const dropdownRef = useRef(null);
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
	const onClick = () => setIsActive(!isActive);
	return (
		<div className="menu-container">
			<div className="trigger-container" onClick={onClick}>
				{trigger}
			</div>
			<nav
				ref={dropdownRef}
				className={`menu ${isActive ? "active" : "inactive"}`}>
				<ul>
					{children.map((el, i) => (
						<li key={i} onClick={onClick}>
							{el}
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default FloatingMenu;
