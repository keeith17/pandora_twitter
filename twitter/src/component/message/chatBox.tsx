import { MessageProps } from "@/pages/message/chat";
import { MessageBoxStyle } from "./chatRoomStyle";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";

interface ChatData {
    message: MessageProps;
}

export function ChatBox({ message }: ChatData) {
    const user = useRecoilValue(userState);
    return (
        <MessageBoxStyle
            className={`${user?.uid === message.sendId ? "mine" : "yours"}`}
        >
            <div className="balloon">{message.content}</div>
        </MessageBoxStyle>
    );
}
