import { TopTitle } from "@/component/Style";
import { NotiWrap } from "./notificationStyle";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { NotiProps } from "@/component/comment/commentForm";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQuery } from "react-query";
import { NotiBox } from "@/component/notification/notiBox";

export default function NotificationsPage() {
    const user = useRecoilValue(userState);

    const fetchNoti = async () => {
        try {
            const existRef = collection(db, "notifications");
            const existQuery = query(existRef, where("uid", "==", user?.uid));
            const existSnapshot = await getDocs(existQuery);
            const existData = existSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as NotiProps[];
            return existData;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    const { data: notifications } = useQuery("notification", fetchNoti, {
        staleTime: 20000,
    });
    return (
        <NotiWrap>
            <TopTitle>
                <div className="title">
                    <div className="text">Notifications</div>
                </div>
            </TopTitle>
            <div className="notiBox">
                {notifications?.map((noti, index) => (
                    <NotiBox noti={noti} key={index} />
                ))}
            </div>
        </NotiWrap>
    );
}
