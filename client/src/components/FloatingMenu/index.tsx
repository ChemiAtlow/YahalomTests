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
			<div className={`arrow ${isActive ? "active" : "inactive"}`}>
				<nav ref={dropdownRef} className="menu">
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
