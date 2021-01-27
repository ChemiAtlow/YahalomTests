import React from "react";
import { Accordion, AccordionSection, AppButton, MessageModal } from "../components";
import { useModal } from "../hooks";

const Reports: React.FC = () => {
    const { openModal } = useModal();
    const showMessage = (title: string, body: string) =>
        openModal(MessageModal, {
            title,
			children: <p>{body}</p>,
            okText: "SAVE",
            cancelText: "LATER",
        }).promise;
    return (
        <div>
            Reports
            <AppButton onClick={() => showMessage("Title!", "Example")}>Open provided modal</AppButton>
            <Accordion>
                <AccordionSection title="ABC"><p>123</p><p>567</p></AccordionSection>
                <AccordionSection title="DEF"><p>890</p><p>412</p></AccordionSection>
            </Accordion>
        </div>
    );
};

export default Reports;
