import React, { useMemo } from "react";
import { AppButton } from "../Forms";

interface PaginationProps {
    currentPage: number;
    maximalPage: number;
    onClick: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, maximalPage, onClick }) => {
    const prevPage = useMemo(() => currentPage - 1, [currentPage]);
    const nextPage = useMemo(() => currentPage + 1, [currentPage]);
    return (
        <span className="pagination-wrapper">
            {currentPage > 2 && <AppButton color="gray" varaiety="small" onClick={() => onClick(1)}>1</AppButton>}
            {currentPage > 3 && <AppButton color="gray" varaiety="small" disabled>...</AppButton>}
            {currentPage > 1 && <AppButton color="gray" varaiety="small" onClick={() => onClick(prevPage)}>{prevPage}</AppButton>}
            <AppButton varaiety="small" className="current" disabled>{currentPage}</AppButton>
            {currentPage < maximalPage && <AppButton color="gray" varaiety="small" onClick={() => onClick(nextPage)}>{nextPage}</AppButton>}
            {currentPage < maximalPage - 2 && <AppButton color="gray" varaiety="small" disabled>...</AppButton>}
            {currentPage < maximalPage - 1 && <AppButton color="gray" varaiety="small" onClick={() => onClick(maximalPage)}>{maximalPage}</AppButton>}
        </span>
    );
};

export default Pagination;
