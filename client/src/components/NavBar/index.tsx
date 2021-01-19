import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";
import FloatingMenu from "../FloatingMenu";
import "./NavBar.scoped.scss";

const NavBar: React.FC = () => {
	const { jwt, activeStudyField, signout } = useAuth();
	return (
		<header className="main__header">
			<div className="main__header-title">
				<h1>Yahalom Tests</h1>
			</div>
			{jwt && (
				<FloatingMenu
					trigger={
						<div className="main__header-more">
							<div className="main__header-more__dot" />
							<div className="main__header-more__dot" />
							<div className="main__header-more__dot" />
							<div className="main__header-more__back" />
						</div>
					}>
					{activeStudyField && (
						<>
							<Link to="/questions">Manage questions</Link>
							<Link to="/tests">Manage tests</Link>
							<Link to="/reports">Reports </Link>
						</>
					)}
					<div onClick={() => signout()}>Log out</div>
				</FloatingMenu>
			)}
		</header>
	);
};

export default NavBar;
