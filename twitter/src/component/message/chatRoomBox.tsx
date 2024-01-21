import { twiterInfoState, userState } from "@/atom";
import { ChatRoomsProps } from "@/pages/message";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ChatRoomWrap } from "./chatRoomStyle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useMutation } from "react-query";

interface RoomData {
    chatRoom: ChatRoomsProps;
}

export function ChatRoomBox({ chatRoom }: RoomData) {
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const memberList = useRecoilValue(twiterInfoState);
    const uidToName = () => {
        if (chatRoom) {
            const partner = chatRoom.participants.filter(
                (person) => person !== user?.uid
            )[0];
            for (const member of memberList) {
                if (member.uid === partner) {
                    return member.nickname;
                }
            }
            return "none";
        } else {
            return "none";
        }
    };
    const uidToPhoto = () => {
        if (chatRoom) {
            const partner = chatRoom.participants.filter(
                (person) => person !== user?.uid
            )[0];
            for (const member of memberList) {
                if (member.uid === partner) {
                    return member.imageUrl;
                }
            }
            return "none";
        } else {
            return "none";
        }
    };

    const deleteNew = useMutation(async () => {
        const postRef = doc(db, "chatRooms", chatRoom.uid);
        if (chatRoom.lastSender !== user?.uid) {
            await updateDoc(postRef, {
                newMessage: 0,
            });
        }
    });

    const handleClick = () => {
        deleteNew.mutate();
        navigate(`/message/${chatRoom.uid}`);
    };
    return (
        <ChatRoomWrap onClick={handleClick}>
            <div className="partnerPhoto">
                <img src={uidToPhoto()} alt="partnerPhoto" />
            </div>
            <div className="chatInfo">
                <div className="partner">
                    <span className="partnerNick">{uidToName()}</span>
                    <span className="lastTime">{chatRoom.createdAt}</span>
                </div>
                <div className="lastMessage">{chatRoom.lastMessage}</div>
                {chatRoom.lastSender !== user?.uid &&
                    chatRoom.newMessage > 0 && (
                        <div className="newCount">{chatRoom.newMessage}</div>
                    )}
            </div>
        </ChatRoomWrap>
    );
}
