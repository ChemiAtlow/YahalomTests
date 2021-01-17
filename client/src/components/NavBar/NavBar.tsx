import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";
import "./NavBar.scoped.scss";

const NavBar: React.FC = () => {
	const { jwt, signout } = useAuth();
	return (
		<header className="main__header">
			<div className="main__header-title">
				<h1>Yahalom Tests</h1>
			</div>
			<nav className="main__header-links">
				{jwt ? (
					<>
						<Link
							className="main__header-links__item"
							to="/questions">
							<div className="main__header-links__item-text">
								Manage questions
							</div>
							<div className="main__header-links__item-back " />
						</Link>
						<Link className="main__header-links__item" to="/tests">
							<div className="main__header-links__item-text">
								Manage tests
							</div>
							<div className="main__header-links__item-back " />
						</Link>
						<Link
							className="main__header-links__item"
							to="/reports">
							<div className="main__header-links__item-text">
								Reports
							</div>
							<div className="main__header-links__item-back " />
						</Link>
						<div
							className="main__header-links__item"
							onClick={signout}>
							<div className="main__header-links__item-text">
								Logout
							</div>
							<div className="main__header-links__item-back logout" />
						</div>
					</>
				) : (
					<Link className="main__header-links__item" to="/login">
						Login
					</Link>
				)}
			</nav>
		</header>
	);
};

export default NavBar;
