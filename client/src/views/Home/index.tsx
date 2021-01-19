import React from "react";
import { Select } from "../../components";
import "./Home.scoped.scss";

const Home: React.FC = () => {
	return (
		<div className="home-page">
			<span>
				Please select the Study Field you would currently like to work
				on.
			</span>
			<Select label="Form field" type="select" />
		</div>
	);
};

export default Home;
