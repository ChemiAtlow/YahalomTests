import React, { useState } from "react";
import { Container, DatePicker } from "../components";

const Reports: React.FC = () => {
    const [timestamp, setTimestamp] = useState(0);
    return (
        <Container>
            Reports
            <br />
            current Date: {timestamp}
            <DatePicker label="Start date" onChange={setTimestamp} />
        </Container>
    );
};

export default Reports;
