import React from "react";
import "./SearchRow.scoped.scss";

const SearchRow: React.FC = ({ children }) => {
    return <div className="search-row">{children}</div>;
};

export default SearchRow;
