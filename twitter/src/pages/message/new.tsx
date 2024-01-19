import { InputStyle, TopTitle } from "@/component/Style";
import { IoIosArrowBack, IoIosClose, IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { NewMessageStyle, SendTextStyle } from "./messageStyle";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useMutation, useQueryClient } from "react-query";
import { PROFILE_DEFAULT_URL } from "../login/first";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { twiterInfoState, userState } from "@/atom";

export default function NewMessagePage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const memberList = useRecoilValue(twiterInfoState);
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
    const ClickSendTo = (e: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setSendTo(value);
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

    //uid로 저장한 것 photoUrl로 변환
    // const uidToPhoto = (uid: string) => {
    //     if (memberList) {
    //         for (const member of memberList) {
    //             if (member.uid === uid) {
    //                 return member.imageUrl;
    //             }
    //         }
    //         return null;
    //     } else {
    //         return null;
    //     }
    // };

    //sendTo 선택 취소
    const cancleSendTo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSendTo("");
        setSearchWord("");
    };

    //채팅방 생성, 메시지 저장
    const makeChat = useMutation(async () => {
        try {
            setIsSubmitting(true);
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
            await addDoc(collection(db, "messages"), {
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
                sendId: user?.uid,
                isRead: false,
                participants: [user?.uid, sendTo],
            });
            await queryClient.invalidateQueries(["chatRoomInfo", docRef.id]);
            await queryClient.invalidateQueries(["messages", docRef.id]);
            navigate(`/message/${docRef.id}`);
        } catch (error) {
            console.log(error);
        }
        setIsSubmitting(false);
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
