import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppButton, Select } from "../../components";
import { useAuth } from "../../hooks";

const buildItemsForSelect = (arr: { id?: string, name: string }[]) =>
	(arr || []).map(({ name: label, id: value }) => ({ label, value }));

const Home: React.FC = () => {
	const { replace } = useHistory();
	const {
		organizationBaseInfo,
		activeOrganization,
		activeStudyField,
		setActiveOrganization,
		setActiveStudyField,
		getOrganizationAndFieldUrl
	} = useAuth();
	const organizations = buildItemsForSelect(organizationBaseInfo || []); //user organizations
	const relevantFields = buildItemsForSelect(activeOrganization?.fields || []); //organization fields
	const [linkError, setLinkError] = useState("");
	const { state } = useLocation<{ from: { pathname: string; } }>();
	useEffect(() => {
		if (state?.from?.pathname) {
			const [, organizationId, studyFieldId] = state.from.pathname.split("/");
			if (models.classes.Guid.isValid(organizationId || "") && models.classes.Guid.isValid(studyFieldId || "")) {
				const organizationWithRequestedId = organizationBaseInfo?.find(org => org.id === organizationId)
				if (organizationWithRequestedId) {
					setActiveOrganization(organizationWithRequestedId);
					const requestedStudyField = organizationWithRequestedId.fields.find(fld => fld.id === studyFieldId);
					if (requestedStudyField) {
						setActiveStudyField(requestedStudyField);
						replace(state.from.pathname)
					} else {
						setLinkError("Your organization doesn't have this study field!")
					}
				} else {
					setLinkError("You are not permmited to reach requested organization!")
				}
			}
		}
		if (organizationBaseInfo?.length === 1) {
			setActiveOrganization(organizationBaseInfo[0])
			if (organizationBaseInfo[0].fields.length === 1) {
				//There is only one organization, and one studyField, user has no buisness here.
				//Mark his organization and studyField then move him away.
				setActiveStudyField(organizationBaseInfo[0].fields[0]);
				replace(getOrganizationAndFieldUrl("questions"));
			}
		}
	}, [state, organizationBaseInfo, getOrganizationAndFieldUrl, setActiveOrganization, setActiveStudyField, setLinkError, replace]);

	const getSelectedIndex = (e: React.ChangeEvent<HTMLSelectElement>) => e.target.selectedIndex - 1;
	const onOrganizationChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const index = getSelectedIndex(e);
		const organization = organizationBaseInfo?.find(org => org.id === organizations[index].value);
		setActiveOrganization(organization);
	};
	const onStudyFieldChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const index = getSelectedIndex(e);
		const field = activeOrganization?.fields.find(f => f.id === relevantFields[index].value);
		setActiveStudyField(field);
	};
	const handleClick = () => {
		replace(state?.from?.pathname || getOrganizationAndFieldUrl("questions"));
	};

	return (
		<div className="container">
			<span>
				In order to continue, select organization and field to work on.
			</span>
			{ linkError && <b>{linkError}</b> }
			{ !organizationBaseInfo?.length ? <p>It seems you are not connected to any organization!</p>
				:
				<>
					<Select
						label="Organization"
						onChange={onOrganizationChanged}
						disabled={organizationBaseInfo.length === 1}
						value={activeOrganization?.id}
						options={organizations}
					/>
					{ !activeOrganization ?
						<p>Please select an organization first!</p> :
						activeOrganization?.fields.length > 0 ?
							<Select
								label="Study field"
								onChange={onStudyFieldChanged}
								value={activeStudyField?.id}
								options={relevantFields}
							/> : <p>The organization has no study field yet!</p>}
					{activeOrganization && activeStudyField && <AppButton onClick={handleClick}>Continue</AppButton>}
				</>
			}
		</div>
	);
};

export default Home;
