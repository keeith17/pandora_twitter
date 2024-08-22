import { userState } from "@/atom";
import { ButtonStyle, NoTitle, TopTitle } from "@/component/Style";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Profile, ProfileTabs, ProfileText } from "./profileStyle";
import { useState } from "react";
import { PostBox } from "@/component/post/PostBox";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { PostProps } from "../home";
import { useQuery } from "react-query";
import { QPage } from "@/component/manageQ/QPage";

type TabType = "my" | "like" | "Q";

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const [activeTab, setActiveTab] = useState<TabType>("my");
    const PROFILE_DEFAULT_URL = "/images/seederEdit.webp";

    //데이터 받아 오기
    const FetchMyPosts = async () => {
        try {
            const postRef = collection(db, "posts");
            const postQuery = query(
                postRef,
                where("uid", "==", user?.uid),
                orderBy("createdAt", "desc")
            );
            const MyPostsSnapshot = await getDocs(postQuery);
            const data = MyPostsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PostProps[];
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const FetchLikePosts = async () => {
        try {
            const postRef = collection(db, "posts");
            const postQuery = query(
                postRef,
                where("likes", "array-contains", user?.uid),
                orderBy("createdAt", "desc")
            );
            const LikePostsSnapshot = await getDocs(postQuery);
            const data = LikePostsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PostProps[];
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const { data: myPosts } = useQuery("FetchMyPosts", FetchMyPosts, {
        staleTime: 20000,
    });
    const { data: likePosts } = useQuery("FetchLikePosts", FetchLikePosts, {
        staleTime: 20000,
    });
    return (
        <div className="profile">
            <TopTitle>
                <div className="title">
                    <div className="text">Profile</div>
                </div>
            </TopTitle>
            <Profile>
                <img
                    src={user?.photoURL || PROFILE_DEFAULT_URL}
                    className="profileImage"
                    alt="profile"
                    width={100}
                    height={100}
                />
                <div className="profileEdit">
                    <ButtonStyle
                        type="button"
                        className="profileBtn"
                        fontSize="15px"
                        onClick={() => {
                            navigate("/profile/edit");
                        }}
                    >
                        수정
                    </ButtonStyle>
                </div>
            </Profile>
            <ProfileText>
                <div className="profileName">{user?.displayName || "익명"}</div>
                <div className="profileEmail">{user?.email}</div>
            </ProfileText>
            <ProfileTabs>
                <div
                    className={`profileTab ${
                        activeTab === "my" && "tabActive"
                    }`}
                    onClick={() => {
                        setActiveTab("my");
                    }}
                >
                    내가 쓴 글
                </div>
                <div
                    className={`profileTab ${
                        activeTab === "like" && "tabActive"
                    }`}
                    onClick={() => {
                        setActiveTab("like");
                    }}
                >
                    좋아요
                </div>
                <div
                    className={`profileTab ${activeTab === "Q" && "tabActive"}`}
                    onClick={() => {
                        setActiveTab("Q");
                    }}
                >
                    Q 관리
                </div>
            </ProfileTabs>
            {activeTab === "my" && (
                <div className="post">
                    {myPosts && myPosts?.length > 0 ? (
                        myPosts?.map((post) => (
                            <PostBox post={post} key={post.id} />
                        ))
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    )}
                </div>
            )}
            {activeTab === "like" && (
                <div className="post">
                    {likePosts && likePosts?.length > 0 ? (
                        likePosts?.map((post) => (
                            <PostBox post={post} key={post.id} />
                        ))
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    )}
                </div>
            )}
            {activeTab === "Q" && <QPage />}
        </div>
    );
}
