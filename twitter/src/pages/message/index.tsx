import {
    chargeModalState,
    myInfoState,
    twiterInfoState,
    twitterInfoProps,
    userState,
} from "@/atom";
import { TopTitle } from "@/component/Style";
import { ChatRoomBox } from "@/component/message/chatRoomBox";
import { db } from "@/firebaseApp";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { FaPlus } from "react-icons/fa6";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
    const [myInfo, setMyInfo] = useRecoilState(myInfoState);
    const setIsChargeModal = useSetRecoilState(chargeModalState);

    //내 트윗 정보 페치
    const FetchMyInfo = async () => {
        if (user) {
            try {
                const docRef = doc(db, "twiterInfo", user?.uid);
                const postSnap = await getDoc(docRef);
                const data = {
                    ...postSnap?.data(),
                    uid: user.uid,
                } as twitterInfoProps;
                if (!myInfo) {
                    setMyInfo(data);
                }
                return data;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };

    useQuery("myInfo", FetchMyInfo, {
        staleTime: 60000,
    });

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

    //충전 모달 열기
    const openChargeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsChargeModal(true);
    };

    return (
        <MessageWrapStyle>
            <TopTitle>
                <div className="title">
                    <div className="text">Messages</div>
                    <div className="buttons">
                        <div className="leftMsg">R: {myInfo?.leftMsg} 개</div>
                        <button
                            className="addMsgCount"
                            onClick={openChargeModal}
                        >
                            충전
                        </button>
                        <button
                            type="button"
                            className="addNewMsg"
                            onClick={() => navigate("/message/new")}
                        >
                            <FaPlus size={20} />
                        </button>
                    </div>
                </div>
            </TopTitle>
            <div className="chatRoomList">
                {chatRoomList && chatRoomList.length > 0 ? (
                    chatRoomList.map(
                        (chatRoom: ChatRoomsProps, index: number) => (
                            <ChatRoomBox key={index} chatRoom={chatRoom} />
                        )
                    )
                ) : (
                    <div className="noMsg">새로운 대화를 시작해 주세요</div>
                )}
            </div>
        </MessageWrapStyle>
    );
}
