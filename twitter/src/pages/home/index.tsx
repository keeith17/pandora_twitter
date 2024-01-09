import { TopTitle } from "@/component/Style";
import { HomeWrap, PostWrap } from "./homeStyle";
import PostForm from "@/component/post/PostForm";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQuery } from "react-query";
import { PostBox } from "@/component/post/PostBox";
export interface PostProps {
    id: string;
    content: string;
    createdAt: string;
    hashTag?: string;
    imgUrl?: string;
    profileUrl?: string;
    uid: string;
}
export default function HomePage() {
    // 전체 포스트 받아오기
    const FetchAllPosts = async () => {
        const postRef = collection(db, "posts");
        const postQuery = query(postRef, orderBy("createdAt", "desc"));
        const AllPostsSnapshot = await getDocs(postQuery);
        const data = AllPostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return data;
    };

    const { data: AllPosts } = useQuery("AllPosts", FetchAllPosts, {
        staleTime: 30000, // 캐시된 데이터가 30초 후에 만료됨
    });

    return (
        <HomeWrap>
            <TopTitle>
                <div className="title">
                    <div className="text">home</div>
                </div>
            </TopTitle>
            <PostForm />
            <PostWrap>
                {AllPosts ? (
                    AllPosts?.map((post) => (
                        <PostBox post={post} key={post.id} />
                    ))
                ) : (
                    <div className="post__no-posts">
                        <div className="post__text">작성된 글이 없습니다.</div>
                    </div>
                )}
            </PostWrap>
        </HomeWrap>
    );
}
