import { twiterInfoState, twitterInfoProps, userState } from "@/atom";
import { db } from "@/firebaseApp";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { LogList, QStyle } from "./QStyle";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { ButtonStyle, InputStyle } from "../Style";

export interface QLogProps {
    id: string;
    log: string;
    timeStamp: Timestamp;
}

export interface QProps {
    credit: number;
    name: string;
    uid: string;
}
export function QPage() {
    const user = useRecoilValue(userState);
    const [twitterInfo, setTwitterInfo] = useRecoilState(twiterInfoState);
    const [sendTo, setSendTo] = useState<string>("");
    const [searchWord, setSearchWord] = useState<string>("");
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
    };
    //보낼 사람 등록
    const ClickSendTo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setSendTo(value);
    };

    //uid로 저장한 것 이름으로 변환
    const uidToName = (uid: string) => {
        if (twitterInfo) {
            for (const member of twitterInfo) {
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
        staleTime: 1000 * 60 * 60,
        onSuccess: (memberList) => {
            setTwitterInfo(memberList);
        },
    });

    // Q 자체 페치
    const fetchQ = async () => {
        if (user?.uid) {
            try {
                const Qref = doc(db, "money", user.uid);
                const QSnapshot = await getDoc(Qref);
                const data = {
                    ...QSnapshot?.data(),
                } as QProps;
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    };
    const { data: QInfo } = useQuery("QInfo", fetchQ, {
        staleTime: 20000,
    });

    // Q 로그 페치
    const fetchQLog = async () => {
        if (user?.uid) {
            try {
                const QlogRef = collection(db, "money", user.uid, "log");
                const QlogQuery = query(QlogRef, orderBy("timeStamp", "desc"));
                const QlogSnapshot = await getDocs(QlogQuery);
                const QlogData = QlogSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as QLogProps[];
                return QlogData;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };
    const { data: Qlog } = useQuery("Qlog", fetchQLog, {
        staleTime: 20000,
    });
    return (
        <QStyle>
            <form>
                <div className="myQ">
                    <div className="q">
                        {QInfo?.credit} Q<p>현재 소지</p>
                    </div>
                    <div className="makeQ">
                        <div className="sendTo">
                            {sendTo ? (
                                <button
                                    className="selectedName"
                                    onClick={cancleSendTo}
                                >
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
                                        placeholder="대상"
                                        onChange={onChange}
                                    />
                                    <div className="memberList">
                                        {twitterInfo?.map(
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
                                                                    : ""
                                                            }
                                                            alt="memberImg"
                                                        />
                                                        <span>
                                                            {member.nickname}
                                                        </span>
                                                    </button>
                                                )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="inputBox2">
                            <InputStyle
                                fontSize={"13px"}
                                fontFamily={"nexonGothic"}
                                height={"100%"}
                                border={"none"}
                                placeholder="송금할 금액"
                            />
                        </div>
                    </div>
                </div>
                <div className="buttonBox">
                    <ButtonStyle fontSize={"16px"}>전송</ButtonStyle>
                </div>
            </form>
            {Qlog?.map((log) => (
                <LogList key={log.id}>{log.log}</LogList>
            ))}
        </QStyle>
    );
}
