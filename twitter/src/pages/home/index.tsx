import { NoTitle, TopTitle } from "@/component/Style";
import { HomeTabs, HomeWrap, PostWrap } from "./homeStyle";
import PostForm from "@/component/post/PostForm";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQuery } from "react-query";
import { PostBox } from "@/component/post/PostBox";
import Loader from "@/component/loader/Loader";
import { useState } from "react";
export interface PostProps {
    id: string; // 문서번호
    content: string;
    createdAt: string;
    imgUrl?: string;
    uid: string; // 사용자 아이디
    likes?: string[];
    likeCount?: number;
    comments?: string[];
}
export default function HomePage() {
    const [activeTab, setActiveTab] = useState<string>("all");
    // 전체 포스트 받아오기
    const FetchAllPosts = async () => {
        try {
            const postRef = collection(db, "posts");
            const postQuery = query(postRef, orderBy("createdAt", "desc"));
            const AllPostsSnapshot = await getDocs(postQuery);
            const data = AllPostsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PostProps[];
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data: AllPosts, isLoading } = useQuery("AllPosts", FetchAllPosts, {
        staleTime: 30000, // 캐시된 데이터가 30초 후에 만료됨
    });

    return (
        <HomeWrap>
            <TopTitle>
                <div className="title">
                    <div className="text">home</div>
                </div>
                <HomeTabs>
                    <div
                        className={`homeTab ${
                            activeTab === "all" && "tabActive"
                        }`}
                        onClick={() => {
                            setActiveTab("all");
                        }}
                    >
                        전체
                    </div>
                    <div
                        className={`homeTab ${
                            activeTab === "notice" && "tabActive"
                        }`}
                        onClick={() => {
                            setActiveTab("notice");
                        }}
                    >
                        공지
                    </div>
                </HomeTabs>
            </TopTitle>
            <PostForm />
            {isLoading ? (
                <Loader />
            ) : (
                <PostWrap>
                    {AllPosts ? (
                        AllPosts?.map((post) =>
                            activeTab === "all" ? (
                                <PostBox post={post} key={post.id} />
                            ) : (
                                post.uid === "FYDRcBpPxnbDiPrb9cK7CGL6Man2" && (
                                    <PostBox post={post} key={post.id} />
                                )
                            )
                        )
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    )}
                </PostWrap>
            )}
        </HomeWrap>
    );
}
