import React from "react";
import { Column } from ".";
import "./Row.scoped.scss";

interface RowProps {
    columns: Column[];
    record: { [key: string]: any };
    onRowClicked?: React.MouseEventHandler<HTMLDivElement>;
};

const Row: React.FC<RowProps> = ({ record, columns, onRowClicked }) => {
    return (
        <div className="table-row" onClick={onRowClicked}>
            {columns.map((col, colInd) => (
                <div
                    className={`col ${col.smallColumn ? "col__small" : ""} ${
                        col.largeColumn ? "col__large" : ""
                    }`}
                    key={`col-${colInd}`}>
                    {col.key === undefined ? (
                        <col.template />
                    ) : col.template ? (
                        <col.template data={col.key === "*" ? record : record[col.key]} />
                    ) : (
                        record[col.key]
                    )}
                </div>
            ))}
        </div>
    );
};
export default Row;
