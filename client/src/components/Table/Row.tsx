import React from "react";

const Row: React.FC<{
	columns: string[];
	record: { [key: string]: any };
	rowInd: number;
}> = ({ record, rowInd, columns }) => {
	return (
		<div className="row">
			{columns.map((col, colInd) => (
				<div key={`row-${rowInd}-col-${colInd}`}>{record[col]}</div>
			))}
		</div>
	);
};
export default Row;
