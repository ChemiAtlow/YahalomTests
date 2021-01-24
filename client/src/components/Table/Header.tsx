import React from "react";
import { Column, SortedColumn } from ".";
import Icon from "../Icon";
import "./Header.scoped.scss";

const Header: React.FC<{
    columns: Column[];
    onSort: (col: Column) => void;
    sortedColumn?: SortedColumn;
}> = ({ columns, onSort, sortedColumn }) => {
    const { col: sortedCol, direction } = sortedColumn || {};
    const sortIcon = direction === "Ascending" ? "sortAscending" : "sortDescending";
    return (
        <div className="header">
            {columns.map((column, i) => (
                <div
                    key={`header-${i}`}
                    className={`${column.smallColumn ? "header__small" : ""}${
                        column.largeColumn ? " header__large" : ""
                    }${column === sortedCol ? " sorted" : ""}${column.sortable ? " sortable" : ""}`}
                    onClick={() => onSort(column)}>
                    {column.label}
                    {sortedCol === column && <Icon color="white" icon={sortIcon} />}
                </div>
            ))}
        </div>
    );
};
export default Header;
