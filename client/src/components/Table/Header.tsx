import React from 'react';
import { Column, SortedColumn } from '.';
import Icon from '../Icon';
import './Header.scoped.scss';

interface HeaderProps {
    columns: Column[];
    onSort: (col: Column) => void;
    sortedColumn?: SortedColumn;
    stickAtTop?: boolean;
}

const Header: React.FC<HeaderProps> = ({ columns, onSort, sortedColumn, stickAtTop }) => {
    const { col: sortedCol, direction } = sortedColumn || {};
    const sortIcon = direction === 'Ascending' ? 'sortAscending' : 'sortDescending';
    return (
        <div className="header-wrapper">
            <div className={`header ${stickAtTop ? 'stick-at-top' : ''}`}>
                {columns.map((column, i) => (
                    <div
                        key={`header-${i}`}
                        className={`${column.smallColumn ? 'header__small' : ''}${
                            column.largeColumn ? ' header__large' : ''
                        }${column === sortedCol ? ' sorted' : ''}${
                            column.sortable ? ' sortable' : ''
                        }`}
                        onClick={() => onSort(column)}>
                        <span>{column.label}</span>
                        {sortedCol === column && (
                            <Icon color="white" icon={sortIcon} size={20} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Header;
