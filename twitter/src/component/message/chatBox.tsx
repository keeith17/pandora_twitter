import { MessageProps } from "@/pages/message/chatPage";
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
            {message.sendId !== user?.uid ? (
                <>
                    <div className="senderPhoto">
                        {message.prevSender !== message.sendId && (
                            <img src={message.senderPhoto} alt="전송자 사진" />
                        )}
                    </div>
                    <div className="balloon">
                        <div className="textArea">{message.content}</div>
                    </div>
                </>
            ) : (
                <div className="balloon">
                    <div className="textArea">{message.content}</div>
                </div>
            )}

            <div className="subInfo">
                {/* <div className="readCheck">읽음</div> */}
                <div className="sendTime">{message.createdAt.slice(6, 19)}</div>
            </div>
        </MessageBoxStyle>
    );
}
