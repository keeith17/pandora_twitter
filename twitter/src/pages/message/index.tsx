import { twiterInfoState, twitterInfoProps, userState } from "@/atom";
import { TopTitle } from "@/component/Style";
import { ChatRoomBox } from "@/component/message/chatRoomBox";
import { db } from "@/firebaseApp";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FaPlus } from "react-icons/fa6";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MessageWrapStyle } from "./messageStyle";

export interface ChatRoomsProps {
    uid: string;
    createdAt: string;
    lastMessage: string;
    participants: string[];
    newMessage: number;
    lastSender: string;
}

export default function MessagePage() {
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const setTwitterInfo = useSetRecoilState(twiterInfoState);
    // 멤버 리스트 페치
    const FetchMemberList = async () => {
        const postRef = collection(db, "twiterInfo");
        const postQuery = query(
            postRef,
            where("nickname", "!=", user?.displayName),
            orderBy("nickname", "asc")
        );
        const querySnapshot = await getDocs(postQuery);
        const data: twitterInfoProps[] = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
        })) as twitterInfoProps[];
        return data;
    };
    useQuery<twitterInfoProps[]>("twiterInfo", FetchMemberList, {
        staleTime: 1000 * 60 * 2,
        onSuccess: (memberList) => {
            setTwitterInfo(memberList);
        },
    });

    //채팅방 정보 불러오기
    const FetchChatList = async () => {
        const postRef = collection(db, "chatRooms");
        const postQuery = query(
            postRef,
            where("participants", "array-contains", user?.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(postQuery);
        const data: ChatRoomsProps[] = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
        })) as ChatRoomsProps[];
        return data;
    };
    const { data: chatRoomList } = useQuery<ChatRoomsProps[]>(
        "chatRoomsInfo",
        FetchChatList,
        {
            staleTime: 1000,
        }
    );

    return (
        <MessageWrapStyle>
            <TopTitle>
                <div className="title">
                    <div className="text">Direct Message</div>
                    <button
                        type="button"
                        onClick={() => navigate("/message/new")}
                    >
                        <FaPlus size={20} />
                    </button>
                </div>
            </TopTitle>
            <div className="chatRoomList">
                {chatRoomList &&
                    chatRoomList.map(
                        (chatRoom: ChatRoomsProps, index: number) => (
                            <ChatRoomBox key={index} chatRoom={chatRoom} />
                        )
                    )}
            </div>
        </MessageWrapStyle>
    );
}
