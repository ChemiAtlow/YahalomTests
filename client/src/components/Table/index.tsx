import React, { useEffect, useState } from "react";
import { useSearchAndSort } from "../../hooks";
import Row from "./Row";
import "./Table.scoped.scss";

type arrayItem = { [key: string]: any };
interface DataTableProps {
	data: arrayItem[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
	const { data: filteredData, sort } = useSearchAndSort(data);
	const [columns, setColumns] = useState<string[]>([]);

	useEffect(() => {
		const keys = Object.keys(Object(data[0]));
		setColumns(keys);
	}, [data, setColumns]);

	return (
		<div className="table">
			<div className="header">
				{columns.map((col, i) => (
					<div key={`header-${i}`} onClick={() => sort(col)}>
						{col}
					</div>
				))}
			</div>
			<div className="body">
				{filteredData.length ? (
					<div className="row row-full">No Records yet.</div>
				) : (
					filteredData.map((record, rowInd) => (
						<Row
							columns={columns}
							record={record}
							rowInd={rowInd}
							key={`row-${rowInd}`}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default DataTable;
