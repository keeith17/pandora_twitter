import { useNavigate } from "react-router-dom";
import { NotiProps } from "../comment/commentForm";
import { NotiBoxWrap } from "./notiBoxStyle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQueryClient } from "react-query";

interface NotiBoxProps {
    noti: NotiProps;
}

export function NotiBox({ noti }: NotiBoxProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const onClickNotification = async (url: string) => {
        //isRead 업데이트
        const ref = doc(db, "notifications", noti.id);
        await updateDoc(ref, {
            isRead: true,
            count: 0,
        });
        await queryClient.invalidateQueries("notification");
        navigate(url);
    };
    return (
        <NotiBoxWrap>
            <div onClick={() => onClickNotification(noti?.url)}>
                <div className="createdAt">
                    <div className="when">{noti?.createdAt}</div>
                </div>
                <div className="checkRead">
                    <div className="content">{noti.content}</div>
                    {noti?.isRead === false && (
                        <div className="unread">{noti.count}</div>
                    )}
                </div>
            </div>
        </NotiBoxWrap>
    );
}
