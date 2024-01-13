import { borderColor } from "@/GlobalStyle";
import { InputStyle, NoTitle, TopTitle } from "@/component/Style";
import { useState } from "react";
import { Search } from "./searchStyle";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { PostProps } from "../home";
import { useQuery } from "react-query";
import { PostBox } from "@/component/post/PostBox";

export default function SearchPage() {
    const [search, setSearch] = useState<string>("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e?.target?.value);
    };
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

    const { data: AllPosts } = useQuery("AllPosts", FetchAllPosts, {
        staleTime: 30000, // 캐시된 데이터가 30초 후에 만료됨
    });
    return (
        <div className="search">
            <TopTitle>
                <div className="title">
                    <div className="text">Search</div>
                </div>
            </TopTitle>
            <Search>
                <InputStyle
                    className="ais-SearchBox-input"
                    placeholder="검색어를 입력해 주세요"
                    fontFamily="nexonGothic"
                    fontSize="14px"
                    height="40px"
                    border={`1px solid ${borderColor}`}
                    onChange={handleChange}
                />
                {/* <ButtonStyle fontSize="14px" onClick={handleSubmit}>
                    검색
                </ButtonStyle> */}
            </Search>
            {search === "" ? (
                <NoTitle>
                    <div className="text">해당하는 게시 글이 없습니다</div>
                </NoTitle>
            ) : (
                AllPosts?.map(
                    (post) =>
                        post.content.includes(search) && (
                            <PostBox post={post} key={post.id} />
                        )
                )
            )}
        </div>
    );
}
