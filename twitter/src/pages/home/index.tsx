import {
    QueryDocumentSnapshot,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { db } from "@/firebaseApp";
import {
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQuery,
} from "react-query";
import React, { useState } from "react";
import { HomeTabs, HomeWrap, PostWrap } from "./homeStyle";
import { ButtonStyle, NoTitle, TopTitle } from "@/component/Style";
import PostForm from "@/component/post/PostForm";
import Loader from "@/component/loader/Loader";
import { PostBox } from "@/component/post/PostBox";
import { CommentProps } from "@/component/comment/commentBox";

export interface PostProps {
    id: string; // 포스트 아이디
    content: string;
    createdAt: string;
    imgUrl?: string;
    uid: string; // 유저 아이디
    likes?: string[];
    likeCount?: number;
    comments?: CommentProps[];
    profileUrl?: string;
    nickname?: string;
    tag: string;
}

interface FetchDataResponse {
    data: PostProps[];
    cursor: QueryDocumentSnapshot | undefined;
}

//전체 포스트 (무한)
const fetchAllPosts = async ({
    pageParam,
}: {
    pageParam?: PostProps;
}): Promise<FetchDataResponse> => {
    try {
        const postRef = collection(db, "posts");
        const postQuery = pageParam
            ? query(
                  postRef,
                  orderBy("createdAt", "desc"),
                  startAfter(pageParam),
                  limit(15)
              )
            : query(postRef, orderBy("createdAt", "desc"), limit(15));

        const allPostsSnapshot = await getDocs(postQuery);
        const data = allPostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return {
            data,
            cursor: allPostsSnapshot.docs.length
                ? allPostsSnapshot.docs[allPostsSnapshot.docs.length - 1]
                : undefined,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data");
    }
};
//공지 포스트 페치 (무한x)
const FetchNoticePosts = async () => {
    try {
        const postRef = collection(db, "posts");
        const postQuery = query(
            postRef,
            where("tag", "==", "notice"),
            orderBy("createdAt", "desc")
        );
        const NoticePostsSnapshot = await getDocs(postQuery);
        const data = NoticePostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

//사담 포스트 페치 (무한)
const fetchTalkPosts = async ({
    pageParam,
}: {
    pageParam?: PostProps;
}): Promise<FetchDataResponse> => {
    try {
        const postRef = collection(db, "posts");
        const postQuery = pageParam
            ? query(
                  postRef,
                  where("tag", "==", "talk"),
                  orderBy("createdAt", "desc"),
                  startAfter(pageParam),
                  limit(15)
              )
            : query(
                  postRef,
                  where("tag", "==", "talk"),
                  orderBy("createdAt", "desc"),
                  limit(15)
              );

        const talkPostsSnapshot = await getDocs(postQuery);
        const data = talkPostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return {
            data,
            cursor: talkPostsSnapshot.docs.length
                ? talkPostsSnapshot.docs[talkPostsSnapshot.docs.length - 1]
                : undefined,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data");
    }
};

//정보 포스트 페치 (무한)
const fetchSharePosts = async ({
    pageParam,
}: {
    pageParam?: PostProps;
}): Promise<FetchDataResponse> => {
    try {
        const postRef = collection(db, "posts");
        const postQuery = pageParam
            ? query(
                  postRef,
                  where("tag", "==", "share"),
                  orderBy("createdAt", "desc"),
                  startAfter(pageParam),
                  limit(15)
              )
            : query(
                  postRef,
                  where("tag", "==", "share"),
                  orderBy("createdAt", "desc"),
                  limit(15)
              );

        const sharePostsSnapshot = await getDocs(postQuery);
        const data = sharePostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return {
            data,
            cursor: sharePostsSnapshot.docs.length
                ? sharePostsSnapshot.docs[sharePostsSnapshot.docs.length - 1]
                : undefined,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data");
    }
};

//긴급 포스트 페치 (무한x)
const FetchHotPosts = async () => {
    try {
        const postRef = collection(db, "posts");
        const postQuery = query(
            postRef,
            where("tag", "==", "hotlink"),
            orderBy("createdAt", "desc")
        );
        const HotPostsSnapshot = await getDocs(postQuery);
        const data = HotPostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PostProps[];
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<string>("all");
    //전체 포스트 (무한 스크롤)
    const {
        data: AllPosts,
        fetchNextPage: allNextPage,
        hasNextPage: allHasNext,
        isFetchingNextPage: allFecthingNext,
    }: UseInfiniteQueryResult<FetchDataResponse, Error> = useInfiniteQuery(
        "AllPosts",
        fetchAllPosts,
        {
            getNextPageParam: (lastPage) => lastPage?.cursor,
            staleTime: 20000,
        }
    );

    //공지 포스트 (무한 적용 x)
    const { data: noticePosts } = useQuery(
        "FetchNoticePosts",
        FetchNoticePosts,
        {
            staleTime: 20000,
        }
    );

    //사담 포스트 (무한 스크롤)
    const {
        data: talkPosts,
        fetchNextPage: talkNextPage,
        hasNextPage: talkHasNext,
        isFetchingNextPage: talkFecthingNext,
    }: UseInfiniteQueryResult<FetchDataResponse, Error> = useInfiniteQuery(
        "TalkPosts",
        fetchTalkPosts,
        {
            getNextPageParam: (lastPage) => lastPage?.cursor,
            staleTime: 20000,
        }
    );

    //정보 포스트 (무한 스크롤)
    const {
        data: sharePosts,
        fetchNextPage: shareNextPage,
        hasNextPage: shareHasNext,
        isFetchingNextPage: shareFecthingNext,
    }: UseInfiniteQueryResult<FetchDataResponse, Error> = useInfiniteQuery(
        "SharePosts",
        fetchSharePosts,
        {
            getNextPageParam: (lastPage) => lastPage?.cursor,
            staleTime: 20000,
        }
    );

    //긴급 포스트 (무한 적용 x)
    const { data: hotPosts } = useQuery("FetchHotPosts", FetchHotPosts, {
        staleTime: 20000,
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
                    <div
                        className={`homeTab ${
                            activeTab === "talk" && "tabActive"
                        }`}
                        onClick={() => {
                            setActiveTab("talk");
                        }}
                    >
                        사담
                    </div>
                    <div
                        className={`homeTab ${
                            activeTab === "share" && "tabActive"
                        }`}
                        onClick={() => {
                            setActiveTab("share");
                        }}
                    >
                        정보
                    </div>
                    <div
                        className={`homeTab ${
                            activeTab === "hotlink" && "tabActive"
                        }`}
                        onClick={() => {
                            setActiveTab("hotlink");
                        }}
                    >
                        긴급
                    </div>
                </HomeTabs>
            </TopTitle>
            <PostForm />
            <PostWrap>
                {activeTab === "all" &&
                    AllPosts &&
                    (AllPosts.pages[0].data.length > 0 ? (
                        <>
                            {AllPosts?.pages.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page?.data.map((post) => (
                                        <PostBox post={post} key={post.id} />
                                    ))}
                                </React.Fragment>
                            ))}
                            {allHasNext &&
                                (allFecthingNext ? (
                                    <Loader />
                                ) : (
                                    <ButtonStyle
                                        fontSize="14px"
                                        className="moreBtn"
                                        onClick={() => allNextPage()}
                                        disabled={allFecthingNext}
                                    >
                                        더 보기
                                    </ButtonStyle>
                                ))}
                        </>
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    ))}
                {activeTab === "notice" &&
                    noticePosts &&
                    (noticePosts.length > 0 ? (
                        noticePosts?.map((post) => (
                            <PostBox post={post} key={post.id} />
                        ))
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    ))}
                {activeTab === "talk" &&
                    talkPosts &&
                    (talkPosts.pages[0].data.length > 0 ? (
                        <div>
                            {talkPosts?.pages.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page?.data.map((post) => (
                                        <PostBox post={post} key={post.id} />
                                    ))}
                                </React.Fragment>
                            ))}
                            {talkHasNext &&
                                (talkFecthingNext ? (
                                    <Loader />
                                ) : (
                                    <ButtonStyle
                                        fontSize="14px"
                                        className="moreBtn"
                                        onClick={() => talkNextPage()}
                                        disabled={talkFecthingNext}
                                    >
                                        더 보기
                                    </ButtonStyle>
                                ))}
                        </div>
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    ))}
                {activeTab === "share" &&
                    sharePosts &&
                    (sharePosts.pages[0].data.length > 0 ? (
                        <div>
                            {sharePosts?.pages.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page?.data.map((post) => (
                                        <PostBox post={post} key={post.id} />
                                    ))}
                                </React.Fragment>
                            ))}
                            {shareHasNext &&
                                (shareFecthingNext ? (
                                    <Loader />
                                ) : (
                                    <ButtonStyle
                                        fontSize="14px"
                                        className="moreBtn"
                                        onClick={() => shareNextPage()}
                                        disabled={shareFecthingNext}
                                    >
                                        더 보기
                                    </ButtonStyle>
                                ))}
                        </div>
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    ))}
                {activeTab === "hotlink" &&
                    hotPosts &&
                    (hotPosts.length > 0 ? (
                        hotPosts?.map((post) => (
                            <PostBox post={post} key={post.id} />
                        ))
                    ) : (
                        <NoTitle>
                            <div className="text">
                                해당하는 게시 글이 없습니다
                            </div>
                        </NoTitle>
                    ))}
            </PostWrap>
        </HomeWrap>
    );
}
