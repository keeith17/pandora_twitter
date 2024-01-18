import { twiterInfoState, userState } from "@/atom";
import { TopTitle } from "@/component/Style";
import { db } from "@/firebaseApp";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SendTextStyle } from "./messageStyle";
import { useState } from "react";
import { ChatRoomsProps } from "@/pages/message";

export interface MessageProps {
    content: string;
    createdAt: string;
    isRead: boolean;
    roomId: string;
    sendId: string;
    participants: string[];
    id: string;
}

export default function ChatRoomPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const params = useParams();
    const memberList = useRecoilValue(twiterInfoState);
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    //메시지들 받아 오기
    const FetchMessage = async (paramsId: string | undefined) => {
        if (paramsId) {
            try {
                const postRef = collection(db, "messages");
                const postQuery = query(
                    postRef,
                    where("roomId", "==", paramsId),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(postQuery);
                const data: MessageProps[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as MessageProps[];
                return data;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        } else {
            throw new Error("사용자 UID가 존재하지 않습니다.");
        }
    };
    const { data: messages } = useQuery(["messages", params.id], () =>
        FetchMessage(params.id)
    );

    //채팅방 정보 받아오기
    const FetchRoomInfo = async () => {
        if (params.id) {
            try {
                const docRef = doc(db, "chatRooms", params.id);
                const postSnap = await getDoc(docRef);
                const data = {
                    ...postSnap?.data(),
                    uid: params.id,
                } as ChatRoomsProps;
                return data;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };
    const { data: chatRoomInfo } = useQuery(
        ["chatRoomInfo", params.id],
        FetchRoomInfo
    );
    //상대방 uid
    const partner = messages
        ? messages[0].participants.filter((person) => person !== user?.uid)[0]
        : undefined;

    //uid를 닉네임으로
    const uidToName = (uid: string) => {
        if (memberList) {
            for (const member of memberList) {
                if (member.uid === uid) {
                    return member.nickname;
                }
            }
            return "none";
        } else {
            return "none";
        }
    };

    //메시지 보내기
    const sendChat = useMutation(async () => {
        if (params.id) {
            try {
                setIsSubmitting(true);
                const postRef = doc(db, "chatRooms", params.id);
                await updateDoc(postRef, {
                    lastMessage: content,
                    createdAt: new Date()?.toLocaleDateString("ko", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    }),
                    newMessage: chatRoomInfo?.newMessage
                        ? chatRoomInfo?.newMessage + 1
                        : 1,
                    lastSender: user?.uid,
                });
                await addDoc(collection(db, "messages"), {
                    roomId: params.id,
                    createdAt: new Date()?.toLocaleDateString("ko", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    }),
                    content: content,
                    sendId: user?.uid,
                    isRead: false,
                    participants: [user?.uid, partner],
                });
                setContent("");
                await queryClient.invalidateQueries([
                    "chatRoomInfo",
                    params.id,
                ]);
                await queryClient.invalidateQueries(["messages", params.id]);
            } catch (error) {
                console.log(error);
            }
            setIsSubmitting(false);
        }
    });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        sendChat.mutate();
    };

    const onChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        if (name === "content") {
            setContent(value);
        }
    };
    return (
        <div className="messageWrap">
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate("/message")}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
                    <div>{partner && uidToName(partner)}</div>
                </div>
            </TopTitle>
            <div>
                {messages?.map((message, index) => (
                    <div key={index}>{message.content}</div>
                ))}
            </div>
            <SendTextStyle>
                <div className="textArea">
                    <textarea
                        name="content"
                        value={content}
                        onChange={onChange}
                    ></textarea>
                    {content && (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <IoMdSend size={25} />
                        </button>
                    )}
                </div>
            </SendTextStyle>
        </div>
    );
}
