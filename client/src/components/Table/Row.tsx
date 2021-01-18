import React from "react";
import { Column } from ".";
import "./Row.scss";

const Row: React.FC<{
	columns: Column[];
	record: { [key: string]: any };
	rowInd: number;
}> = ({ record, rowInd, columns }) => {
	return (
		<div className="row">
			{columns.map((col, colInd) => (
				<div className="col" key={`row-${rowInd}-col-${colInd}`}>
					{col.isFromData ? (
						col.template ? (
							<col.template data={record[col.key]} />
						) : (
							record[col.key]
						)
					) : (
						<col.template />
					)}
				</div>
			))}
		</div>
	);
};
export default Row;
