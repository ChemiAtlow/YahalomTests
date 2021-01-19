import React from "react";
import { useSearchAndSort } from "../../hooks";
import Row from "./Row";
import "./Table.scoped.scss";

type ArrayItem = { [key: string]: any };
export type Column = {
	label: string;
	isFromData: boolean;
	template?: React.ComponentType<{ data?: any }>;
} & (
	| { isFromData: true; key: string }
	| { isFromData: false; template: React.ComponentType });
interface DataTableProps {
	data: ArrayItem[];
	columns: Column[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
	const { data: filteredData, sort, sortTerms } = useSearchAndSort(data);

	const sortColumn = (col: Column) => {
		if (!col.isFromData) {
			return;
		}
		let descending = false;
		if (sortTerms.term === col.key) {
			descending = !sortTerms.isDescending;
		}
		sort(col.key, descending);
	};

	return (
		<div className="table">
			<div className="header">
				{columns.map((col, i) => (
					<div key={`header-${i}`} onClick={() => sortColumn(col)}>
						{col.label}
					</div>
				))}
			</div>
			<div className="body">
				{!filteredData.length ? (
					<div className="row row-full">No Records to show.</div>
				) : (
					filteredData.map((record, rowInd) => (
						<Row
							columns={columns}
							record={record}
							key={`row-${rowInd}`}
						/>
					))
				)}
			</div>
		</div>
	);
};
