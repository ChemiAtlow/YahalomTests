import React from "react";
import { NavLink } from "react-router-dom";
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
					<NavLink exact to="/">Select study field</NavLink>
					{activeStudyField && (
						<NavLink to={getOrganizationAndFieldUrl("questions")}>
							Manage questions
						</NavLink>
					)}
					{activeStudyField && (
						<NavLink to={getOrganizationAndFieldUrl("tests")}>
							Manage tests
						</NavLink>
					)}
					{activeStudyField && (
						<NavLink to={getOrganizationAndFieldUrl("reports/student")}>
							Reports per student
						</NavLink>
					)}
					{activeStudyField && (
						<NavLink to={getOrganizationAndFieldUrl("reports/test")}>
							Reports per test
						</NavLink>
					)}
					<div onClick={() => signout()}>Log out</div>
				</FloatingMenu>
			)}
		</header>
	);
};

export default NavBar;
