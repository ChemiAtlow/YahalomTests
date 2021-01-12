import React from "react";
import { models } from "../../../common";

// tsx (typescript) functional component
export interface QuestionsTableProps {
	questions: models.Question[];
}

const QuestionsTable: React.FC<QuestionsTableProps> = (
	props: QuestionsTableProps
) => {
	return (
		<div>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Title</th>
					</tr>
				</thead>
				<tbody>
					{props.questions.map(question => (
						<tr key={question.id}>
							<th scope="row">{question.id}</th>
							<td>{question.title}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default QuestionsTable;
