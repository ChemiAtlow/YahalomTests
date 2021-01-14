import React from "react";
import { models } from "@yahalom-tests/common";

// tsx (typescript) functional component
export interface QuestionsTableProps {
	questions: models.interfaces.Question[];
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions }) => {
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
					{questions.map((q, i) => (
						<tr key={q.id}>
							<th scope="row">{i + 1}</th>
							<td>{q.title}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default QuestionsTable;
