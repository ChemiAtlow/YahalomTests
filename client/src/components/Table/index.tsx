import React, { useState } from "react";
import { useSearchAndSort } from "../../hooks";
import Icon from "../Icon";
import Row from "./Row";
import "./Table.scoped.scss";

type ArrayItem = { [key: string]: any };
export type Column = {
    label: string;
    smallColumn?: boolean;
    template?: React.ComponentType<{ data?: any }>;
} & ({ isFromData: true; key: string } | { isFromData: false; template: React.ComponentType });
interface DataTableProps {
    data: ArrayItem[];
    columns: Column[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
    const { data: filteredData, sort } = useSearchAndSort(data);
    const [sortedColumn, setSortedColumn] = useState<{
        col: Column;
        direction: "Ascending" | "Descending";
    }>();

    const sortColumn = (col: Column) => {
        if (!col.isFromData) {
            return;
		}
        if (!sortedColumn || sortedColumn.col !== col) {
			setSortedColumn({ col, direction: "Ascending" });
			sort({ term: col.key, isDescending: false });
		} else if (sortedColumn.col === col && sortedColumn.direction === "Ascending") {
			setSortedColumn({ col, direction: "Descending" });
			sort({ term: col.key, isDescending: true });
		} else {
			setSortedColumn(undefined);
			sort(undefined)
		}
	};	

    return (
        <div className="table">
            <div className="header">
                {columns.map((col, i) => (
                    <div key={`header-${i}`} onClick={() => sortColumn(col)}>
						{col.label}
						{sortedColumn?.col === col &&
							<Icon color="white" icon={sortedColumn.direction === "Ascending" ? "sortAscending" : "sortDescending"} />
						}
                    </div>
                ))}
            </div>
            <div className="body">
                {!filteredData.length ? (
                    <div className="row row-full">No Records to show.</div>
                ) : (
                    filteredData.map((record, rowInd) => (
                        <Row columns={columns} record={record} key={`row-${rowInd}`} />
                    ))
                )}
            </div>
        </div>
    );
};
