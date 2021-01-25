import React, { useState } from "react";
import { useSearchAndSort } from "../../hooks";
import Header from "./Header";
import Row from "./Row";
import "./Table.scoped.scss";

type ArrayItem = { [key: string]: any };
export type SortedColumn = {
    col: Column;
    direction: "Ascending" | "Descending";
};
export type Column = {
    label: string;
    smallColumn?: boolean;
    largeColumn?: boolean;
    template?: React.ComponentType<{ data?: any }>;
    sortable: boolean;
} & ({ isFromData: true; key: string } | { isFromData: false; template: React.ComponentType });
interface DataTableProps {
    data: ArrayItem[];
    columns: Column[];
    onRowClick?: (data: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns, onRowClick }) => {
    const { data: filteredData, sort } = useSearchAndSort(data);
    const [sortedColumn, setSortedColumn] = useState<SortedColumn>();

    const sortColumn = (col: Column) => {
        if (!col.isFromData || !col.sortable) {
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
            sort(undefined);
        }
    };

    return (
        <div className="table">
            <Header columns={columns} sortedColumn={sortedColumn} onSort={sortColumn} />
            <div className="body">
                {!filteredData.length ? (
                    <div className="row-empty">No Records to show.</div>
                ) : (
                        filteredData.map((record, rowInd) => (
                            <Row onRowClicked={() => onRowClick?.(record)} columns={columns} record={record} key={`row-${rowInd}`} />
                        ))
                    )}
            </div>
        </div>
    );
};
