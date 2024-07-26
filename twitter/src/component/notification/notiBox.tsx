import { useNavigate } from "react-router-dom";
import { NotiProps } from "../comment/commentForm";
import { NotiBoxWrap } from "./notiBoxStyle";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

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
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const confirm = window.confirm("해당 알림을 삭제하시겠습니까?");
        if (confirm) {
            await deleteDoc(doc(db, "notifications", noti.id));
            await queryClient.invalidateQueries("AllPosts");
            toast.success("알림을 삭제했습니다.");
            await queryClient.invalidateQueries("notification");
        }
    };
    return (
        <NotiBoxWrap>
            <div
                className="contentBox"
                onClick={() => onClickNotification(noti?.url)}
            >
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
            <div className="btnBox">
                <button className="delButton" onClick={handleDelete}>
                    X
                </button>
            </div>
        </NotiBoxWrap>
    );
}
