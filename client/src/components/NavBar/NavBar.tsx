import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
	return (
		<div className="main__header">
			<Link to="/questions">Manage questions</Link>
			<Link to="/tests">Manage tests</Link>
			<Link to="/reports">Reports</Link>
		</div>
	);
};

export default NavBar;
