import React, { useEffect, useState } from "react";
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
    sortable: boolean;
} & (
        { key: "*" | string; template?: React.ComponentType<{ data?: any }>; } |
        { key: undefined; template: React.ComponentType }
    );
interface DataTableProps {
    data: ArrayItem[];
    columns: Column[];
    searchTerm?: string;
    searchKeys?: string[];
    activeRows?: { key: string; rows: any[] };
    onRowClick?: (data: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns, onRowClick, searchKeys, searchTerm, activeRows }) => {
    const { data: filteredData, sort, search } = useSearchAndSort(data, searchKeys);
    const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
    useEffect(() => search(searchTerm || ""), [search, searchTerm]);

    const sortColumn = (col: Column) => {
        if (!col.key || !col.sortable) {
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
                        filteredData.map((record, rowInd) => {
                            const isActive = activeRows?.rows.includes(record[activeRows.key] || "");
                            return < Row onRowClicked = {() => onRowClick?.(record)} columns={columns} record={record} key={`row-${rowInd}`} isActive={isActive} />
                        })
                    )}
            </div>
        </div>
    );
};
