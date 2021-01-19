import React from 'react';
import { Tooltip, direction } from '../Tooltip';

interface EllipsisProps {
    data: string;
    maxLength: number;
    direction: direction;
}

const Ellipsis: React.FC<EllipsisProps> = ({ data, maxLength, direction }) => {
    const textToShow = data.length > maxLength ? `${data.substring(0, maxLength - 1).trim()}...` : data;

    return (
        <Tooltip value={data} direction={direction}>
            <span>{textToShow}</span>
        </Tooltip>
    )
}

export default Ellipsis;