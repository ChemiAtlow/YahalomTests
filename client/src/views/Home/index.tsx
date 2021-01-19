import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppButton, Select } from "../../components";
import { useAuth } from "../../hooks";
import "./Home.scoped.scss";

const Home: React.FC = () => {
	const { replace } = useHistory();
	const { organizationBaseInfo, activeOrganization, activeStudyField, setActiveOrganization, setActiveStudyField } = useAuth();

	if(organizationBaseInfo?.length === 1 && organizationBaseInfo[0].fields.length === 1){
		//There is only one organization, and one studyField, user has no buisness here.
		//Mark his organization and studyField then move him away.
		setActiveOrganization(organizationBaseInfo[0]);
		setActiveStudyField(organizationBaseInfo[0].fields[0]);
		replace("/questions");
	}
	const organizations = (organizationBaseInfo || []).map(({ name: label, id: value }) => ({ label, value }));
	const relevantFields = (activeOrganization?.fields.map(({ name: label, id: value }) => ({ label, value })) || []);

	useEffect(() => {
		if (organizationBaseInfo?.length === 1) {
			setActiveOrganization(organizationBaseInfo[0])
		}
	}, [organizationBaseInfo, setActiveOrganization]);


	return (
		<div className="home-page">
			<span>
				In order to continue, select organization and field to work on.
			</span>
			{ !organizationBaseInfo?.length ? <p>It seems you are not connected to any organization!</p> 
			:
				<>
					<Select
						label="Organization"
						onChange={e =>
							setActiveOrganization((organizationBaseInfo.find(org => org.id === organizations[e.target.selectedIndex - 1].value)!))
						}
						disabled={organizationBaseInfo.length === 1}
						value={activeOrganization?.id}
						options={organizations}
					/>
					<Select
						label="Study field"
						onChange={e => setActiveStudyField((activeOrganization?.fields.find(f => f.id === relevantFields[e.target.selectedIndex - 1].value)!))						}
						value={activeStudyField?.id}
						options={relevantFields}
					/>
					<AppButton disabled={!activeOrganization || !activeStudyField} onClick={() => replace("/questions")}>Continue</AppButton>
				</>
			}
		</div>
	);
};

export default Home;
