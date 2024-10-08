import {
    chargeModalState,
    myInfoState,
    twitterInfoProps,
    userState,
} from "@/atom";
import { ButtonStyle, NoTitle, TopTitle } from "@/component/Style";
import { db } from "@/firebaseApp";
import {
    QueryDocumentSnapshot,
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
} from "firebase/firestore";
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import {
    UseInfiniteQueryResult,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ChatWrapStyle, SendTextStyle } from "./messageStyle";
import { useEffect, useRef, useState } from "react";
import { ChatRoomsProps } from "@/pages/message";
import { ChatBox } from "@/component/message/chatBox";
import React from "react";
import Loader from "@/component/loader/Loader";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";

export interface MessageProps {
    content: string;
    createdAt: string;
    isRead: boolean;
    roomId: string;
    senderPhoto: string;
    sendId: string;
    prevSender: string;
    participants: string[];
    id: string;
}
interface FetchDataResponse {
    data: MessageProps[];
    cursor: QueryDocumentSnapshot | undefined;
}
export default function ChatRoomPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const user = useRecoilValue(userState);
    const [myInfo, setMyInfo] = useRecoilState(myInfoState);
    const setIsChargeModal = useSetRecoilState(chargeModalState);
    const params = useParams();
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    //시작하자마자 가장 하단으로 스크롤링
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    //메시지들 받아 오기
    const FetchMessage = async ({
        pageParam,
    }: {
        pageParam?: MessageProps;
    }): Promise<FetchDataResponse | undefined> => {
        try {
            if (params.id) {
                const roomKey = params.id;
                const postRef = collection(
                    db,
                    "chatRooms",
                    roomKey,
                    "messages"
                );
                const postQuery = pageParam
                    ? query(
                          postRef,
                          orderBy("createdAt", "desc"),
                          startAfter(pageParam),
                          limit(30)
                      )
                    : query(postRef, orderBy("createdAt", "desc"), limit(30));

                const querySnapshot = await getDocs(postQuery);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as MessageProps[];
                return {
                    data,
                    cursor: querySnapshot.docs.length
                        ? querySnapshot.docs[querySnapshot.docs.length - 1]
                        : undefined,
                };
            }
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch data");
        }
    };
    const {
        data: messages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }: UseInfiniteQueryResult<FetchDataResponse, Error> = useInfiniteQuery(
        ["messages", params.id],
        FetchMessage,
        {
            getNextPageParam: (lastPage) => lastPage?.cursor,
        }
    );

    // no 무한 버전
    // const FetchMessage = async () => {
    //     if (params.id) {
    //         try {
    //             const postRef = collection(db, "messages");
    //             const postQuery = query(
    //                 postRef,
    //                 where("roomId", "==", params.id),
    //                 orderBy("createdAt", "desc")
    //             );
    //             const querySnapshot = await getDocs(postQuery);
    //             const data: MessageProps[] = querySnapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             })) as MessageProps[];
    //             return data;
    //         } catch (error) {
    //             console.error("Error fetching posts:", error);
    //         }
    //     } else {
    //         throw new Error("사용자 UID가 존재하지 않습니다.");
    //     }
    // };
    //const { data: messages } = useQuery(["messages", params.id], FetchMessage);

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
    //상대방 uid
    const partner = messages
        ? messages.pages[0].data[0].participants.filter(
              (person) => person !== user?.uid
          )[0]
        : undefined;

    //메시지 보내기
    const sendChat = useMutation(async () => {
        if (params.id) {
            if (myInfo && myInfo.leftMsg > 0) {
                try {
                    setIsSubmitting(true);
                    // 채팅방 정보 업데이트
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
                    await queryClient.invalidateQueries([
                        "chatRoomInfo",
                        params.id,
                    ]);
                    //메시지 등록
                    const messagesCollectionRef = collection(
                        db,
                        "chatRooms",
                        params.id,
                        "messages"
                    );
                    await addDoc(messagesCollectionRef, {
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
                        senderPhoto: user?.photoURL,
                        prevSender: chatRoomInfo?.lastSender,
                        sendId: user?.uid,
                        isRead: false,
                        participants: [user?.uid, partner],
                    });
                    setContent("");
                    await queryClient.invalidateQueries([
                        "messages",
                        params.id,
                    ]);
                    if (user) {
                        const charRef = doc(db, "twiterInfo", user?.uid);
                        await updateDoc(charRef, {
                            leftMsg: myInfo?.leftMsg - 1,
                        });
                        setMyInfo({ ...myInfo, leftMsg: myInfo.leftMsg - 1 });
                    }
                } catch (error) {
                    console.log(error);
                }
                setIsSubmitting(false);
            } else {
                toast.warn("남은 R이 부족합니다!");
            }
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

    //충전 모달 열기
    const openChargeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsChargeModal(true);
    };
    return (
        <ChatWrapStyle>
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate("/message")}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
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
                    {/* <div>{partner && uidToName(partner)}</div> */}
                </div>
            </TopTitle>
            <div ref={scrollRef} className="messages">
                {messages &&
                    (messages.pages[0].data.length > 0 ? (
                        <>
                            <div className="buttonBox">
                                {messages?.pages[0].data.length >= 30 &&
                                    hasNextPage &&
                                    (isFetchingNextPage ? (
                                        <Loader />
                                    ) : (
                                        <ButtonStyle
                                            fontSize="14px"
                                            className="moreBtn"
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                        >
                                            더 보기
                                        </ButtonStyle>
                                    ))}
                            </div>

                            {messages?.pages
                                .slice(0)
                                .reverse()
                                .map((page, pageIndex) => (
                                    <React.Fragment key={pageIndex}>
                                        {page?.data
                                            .slice(0)
                                            .reverse()
                                            .map((message, index) => (
                                                <ChatBox
                                                    key={index}
                                                    message={message}
                                                />
                                            ))}
                                    </React.Fragment>
                                ))}
                        </>
                    ) : (
                        <NoTitle>
                            <div className="text">대화가 없습니다</div>
                        </NoTitle>
                    ))}
                {/* {messages
                    ?.slice(0)
                    .reverse()
                    .map((message, index) => (
                        <ChatBox key={index} message={message} />
                    ))} */}
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
        </ChatWrapStyle>
    );
}
