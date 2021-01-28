import { models, constants } from "@yahalom-tests/common";
import { ModalInstance } from "../../hooks";
import Icon from "../Icon";
import { Tooltip } from "../Tooltip";
import { MessageModal } from "./MessageModal";
import "./TestLinkModal.scoped.scss";

const { clientDomain, clientPort } = constants.URLS;

interface TestLinkModalProps extends ModalInstance {
    title: string;
    id: models.classes.guid;
}

export const TestLinkModal: React.FC<TestLinkModalProps> = ({ close, title, id }) => {
    const link = `${clientDomain}:${clientPort}/exam/${id}`;
    const onCopyToClipboard = async (copy: boolean) => {
        if (copy) {
            await navigator.clipboard.writeText(link);
        }
    };
    return (
        <MessageModal close={close} okText="OK" title={`Link for: "${title}"`}>
            <Tooltip value="Copied to clipboard!" trigger="click" onVisibilityChanged={onCopyToClipboard} attachToChild={true}>
                <pre>
                    <span>{link}</span>
                    <Icon icon="copy" size={24} />
                </pre>
            </Tooltip>
        </MessageModal>
    );
};
