import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";
import FloatingMenu from "../FloatingMenu";
import "./NavBar.scoped.scss";

const NavBar: React.FC = () => {
	const {
		jwt,
		activeStudyField,
		signout,
		getOrganizationAndFieldUrl,
	} = useAuth();

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
					<Link to="/">Select study field</Link>
					{activeStudyField && (
						<Link to={getOrganizationAndFieldUrl("questions")}>
							Manage questions
						</Link>
					)}
					{activeStudyField && (
						<Link to={getOrganizationAndFieldUrl("tests")}>
							Manage tests
						</Link>
					)}
					{activeStudyField && (
						<Link to={getOrganizationAndFieldUrl("reports/student")}>
							Reports per student
						</Link>
					)}
					{activeStudyField && (
						<Link to={getOrganizationAndFieldUrl("reports/test")}>
							Reports per test
						</Link>
					)}
					<div onClick={() => signout()}>Log out</div>
				</FloatingMenu>
			)}
		</header>
	);
};

export default NavBar;
