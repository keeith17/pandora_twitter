import { InputStyle, TopTitle } from "@/component/Style";
import { IoIosArrowBack, IoIosClose, IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { NewMessageStyle, SendTextStyle } from "./messageStyle";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useMutation, useQueryClient } from "react-query";
import { PROFILE_DEFAULT_URL } from "../login/first";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { myInfoState, twiterInfoState, userState } from "@/atom";
import { toast } from "react-toastify";
import { ChatRoomsProps } from "./index";

export default function NewMessagePage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const memberList = useRecoilValue(twiterInfoState);
    const [myInfo, setMyInfo] = useRecoilState(myInfoState);
    const [searchWord, setSearchWord] = useState<string>("");
    const [sendTo, setSendTo] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    //이름 검색
    const onChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        if (name === "searchWord") {
            setSearchWord(value);
        }
        if (name === "content") {
            setContent(value);
        }
    };
    //보낼 사람 등록
    const ClickSendTo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setSendTo(value);
        // const existRef = collection(db, "chatRooms");
        // const existQuery = query(
        //     existRef,
        //     where("participants", "array-contains", user?.uid)
        // );
        // const existSnap = await getDocs(existQuery);
        // const data = existSnap.docs
        //     .filter((doc) => doc.data().participants.includes(value))
        //     .map((doc) => ({
        //         id: doc.id,
        //         ...doc.data(),
        //     }));
        // if (data.length > 0) {
        //     navigate(`/message/${data[0].id}`);
        // } else {
        //     setSendTo(value);
        // }
    };

    //uid로 저장한 것 이름으로 변환
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

    //sendTo 선택 취소
    const cancleSendTo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSendTo("");
        setSearchWord("");
    };

    //채팅방 생성, 메시지 저장
    const makeChat = useMutation(async () => {
        if (myInfo && myInfo.leftMsg > 0) {
            try {
                setIsSubmitting(true);
                //먼저 이미 같은 사람과 대화중이었는지 확인
                const existRef = collection(db, "chatRooms");
                const existQuery = query(
                    existRef,
                    where("participants", "array-contains", user?.uid)
                );
                const existSnap = await getDocs(existQuery);
                const chatRoomData = existSnap.docs
                    .filter((doc) => doc.data().participants.includes(sendTo))
                    .map((doc) => ({
                        uid: doc.id,
                        ...doc.data(),
                    })) as ChatRoomsProps[];
                //대화중인 대화방이 이미 있었을 경우
                if (chatRoomData.length > 0) {
                    await addDoc(
                        collection(
                            db,
                            "chatRooms",
                            chatRoomData[0].uid,
                            "messages"
                        ),
                        {
                            roomId: chatRoomData[0].uid,
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
                            senderPhoto: user?.photoURL,
                            prevSender: chatRoomData[0]?.lastSender,
                            sendId: user?.uid,
                            isRead: false,
                            participants: [user?.uid, sendTo],
                        }
                    );
                    //메시지 차감
                    if (user) {
                        const charRef = doc(db, "twiterInfo", user?.uid);
                        await updateDoc(charRef, {
                            leftMsg: myInfo?.leftMsg - 1,
                        });
                        setMyInfo({ ...myInfo, leftMsg: myInfo.leftMsg - 1 });
                    }
                    await queryClient.invalidateQueries([
                        "chatRoomInfo",
                        chatRoomData[0].uid,
                    ]);
                    await queryClient.invalidateQueries([
                        "messages",
                        chatRoomData[0].uid,
                    ]);
                    navigate(`/message/${chatRoomData[0].uid}`);
                }
                //없을 경우
                else {
                    const docRef = await addDoc(collection(db, "chatRooms"), {
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
                        participants: [user?.uid, sendTo],
                        newMessage: 1,
                        lastSender: user?.uid,
                        // profileUrl: [user?.photoURL, `${uidToPhoto(sendTo)}`],
                    });
                    const roomId = docRef.id;
                    const messagesCollectionRef = collection(
                        db,
                        "chatRooms",
                        roomId,
                        "messages"
                    );
                    await addDoc(messagesCollectionRef, {
                        roomId: docRef.id,
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
                        senderPhoto: user?.photoURL,
                        sendId: user?.uid,
                        isRead: false,
                        participants: [user?.uid, sendTo],
                    });
                    // await addDoc(collection(db, "messages"), {
                    //     roomId: docRef.id,
                    //     createdAt: new Date()?.toLocaleDateString("ko", {
                    //         year: "numeric",
                    //         month: "2-digit",
                    //         day: "2-digit",
                    //         hour: "2-digit",
                    //         minute: "2-digit",
                    //         second: "2-digit",
                    //         hour12: false,
                    //     }),
                    //     content: content,
                    //     senderPhoto: user?.photoURL,
                    //     sendId: user?.uid,
                    //     isRead: false,
                    //     participants: [user?.uid, sendTo],
                    // });
                    //메시지 차감
                    if (user) {
                        const charRef = doc(db, "twiterInfo", user?.uid);
                        await updateDoc(charRef, {
                            leftMsg: myInfo?.leftMsg - 1,
                        });
                        setMyInfo({ ...myInfo, leftMsg: myInfo.leftMsg - 1 });
                    }
                    await queryClient.invalidateQueries([
                        "chatRoomInfo",
                        docRef.id,
                    ]);
                    await queryClient.invalidateQueries([
                        "messages",
                        docRef.id,
                    ]);
                    navigate(`/message/${docRef.id}`);
                }
            } catch (error) {
                console.log(error);
            }
            setIsSubmitting(false);
        } else {
            if (!myInfo) {
                toast.error("전송에 실패했습니다");
            } else if (myInfo?.leftMsg) {
                toast.error("남은 문자 개수가 부족합니다");
            }
        }
    });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        makeChat.mutate();
    };

    return (
        <NewMessageStyle>
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate(-1)}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
                </div>
            </TopTitle>
            <div className="content">
                <div className="sendTo">
                    <div className="text">받는 사람 :</div>
                    {sendTo ? (
                        <button className="selectedName" onClick={cancleSendTo}>
                            {uidToName(sendTo)}
                            <IoIosClose size={20} />
                        </button>
                    ) : (
                        <div className="inputBox">
                            <InputStyle
                                fontSize="15px"
                                fontFamily="nexonGothic"
                                height="100%"
                                border="none"
                                name="searchWord"
                                onChange={onChange}
                            />
                            <div className="memberList">
                                {memberList?.map(
                                    (member) =>
                                        searchWord &&
                                        member.nickname.includes(
                                            searchWord
                                        ) && (
                                            <button
                                                key={member.uid}
                                                value={member.uid}
                                                onClick={ClickSendTo}
                                            >
                                                <img
                                                    src={
                                                        member.imageUrl
                                                            ? member.imageUrl
                                                            : PROFILE_DEFAULT_URL
                                                    }
                                                    alt="memberImg"
                                                />
                                                <span>{member.nickname}</span>
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                    )}
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
        </NewMessageStyle>
    );
}
