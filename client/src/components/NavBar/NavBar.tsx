import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";
import "./NavBar.scoped.scss";

const NavBar: React.FC = () => {
	const { jwt, signout } = useAuth();
	return (
		<div className="main__header">
			<div className="main__header-title">
				<h1>Yahalom Tests</h1>
			</div>
			<div className="main__header-links">
				{jwt ? (
					<>
						<Link
							className="main__header-links__item"
							to="/questions">
							Manage questions
						</Link>
						<Link className="main__header-links__item" to="/tests">
							Manage tests
						</Link>
						<Link
							className="main__header-links__item"
							to="/reports">
							Reports
						</Link>
						<div
							className="main__header-links__item"
							onClick={signout}>
							<div className="logout-text">Logout</div>
							<div className="logout-back" />
						</div>
					</>
				) : (
						<Link className="main__header-links__item" to="/login">
							Login
						</Link>
					)}
			</div>
		</div>
	);
};

export default NavBar;
