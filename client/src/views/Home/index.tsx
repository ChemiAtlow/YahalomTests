import React, { useMemo, useState } from "react";
import { Select } from "../../components";
import { useAuth } from "../../hooks";
import "./Home.scoped.scss";

const Home: React.FC = () => {
	const { organizationBaseInfo } = useAuth();
	const [studyField, setStudyField] = useState("");
	const [organization, setOrganization] = useState("");

	const organizations = (organizationBaseInfo || []).map(({ name: label, id: value }) => ({ label, value }));
	const relevantFields = (() => {
		const selectedOrg = (organizationBaseInfo || []).find(org => org.id === organization);
		const fields = selectedOrg?.fields.map(({ name: label, id: value }) => ({ label, value }));
		return fields || [];
	})();
	useMemo(() => {
		if (organizationBaseInfo?.length && organizationBaseInfo.length === 1) {
			setOrganization(organizationBaseInfo[0].id)
		}
	}, [organizationBaseInfo, setOrganization]);

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
							setOrganization(organizations[e.target.selectedIndex - 1].value)
						}
						disabled={organizationBaseInfo.length === 1}
						value={organization}
						options={organizations}
					/>
					<Select
						label="Study field"
						onChange={e =>
							setStudyField(relevantFields[e.target.selectedIndex - 1].value || "")
						}
						value={studyField}
						options={relevantFields}
					/>
				</>
			}
		</div>
	);
};

export default Home;
