import { PostProps } from "@/pages/home";
import { PostBoxStyle } from "./PostStyle";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ButtonStyle2 } from "../Style";
import {
    arrayRemove,
    arrayUnion,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseApp";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface PostBoxProps {
    post: PostProps;
}

export function PostBox({ post }: PostBoxProps) {
    const PROFILE_DEFAULT_URL = "/images/seederEdit.webp";
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    //말머리 출력 변경
    const tagEngtoKor = (tagEng: string) => {
        if (tagEng === "notice") {
            return "공지";
        }
        if (tagEng === "talk") {
            return "사담";
        }
        if (tagEng === "share") {
            return "정보";
        }
        if (tagEng === "hotlink") {
            return "긴급";
        }
    };

    //게시 글 삭제
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
        if (confirm) {
            await deleteDoc(doc(db, "posts", post.id));
            await queryClient.invalidateQueries("AllPosts");
            toast.success("게시글을 삭제했습니다.");
            navigate("/");
        }
    };

    //좋아요
    const toggleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const postRef = doc(db, "posts", post.id);
        // 좋아요가 돼 있는 경우 -> 삭제
        if (user?.uid && post?.likes?.includes(user?.uid)) {
            await updateDoc(postRef, {
                likes: arrayRemove(user?.uid),
                likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
            });
            await queryClient.invalidateQueries("AllPosts");
        } else {
            // 좋아요가 안 돼 있는 경우 -> 추가
            await updateDoc(postRef, {
                likes: arrayUnion(user?.uid),
                likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
            });
            await queryClient.invalidateQueries("AllPosts");
        }
    };

    return (
        <PostBoxStyle>
            <div className="profile">
                <div className="postFlex">
                    {user?.photoURL ? (
                        <div className="imgBox">
                            <img
                                src={
                                    post.profileUrl
                                        ? post.profileUrl
                                        : PROFILE_DEFAULT_URL
                                }
                                alt="profile"
                                className="img"
                            />
                        </div>
                    ) : (
                        <FaUserCircle className="icon" />
                    )}
                    <div className="flexBetween">
                        <div className="postFlex">
                            <div className="email">
                                {post?.nickname ? post?.nickname : "no name"}
                            </div>
                            <div className="createdAt">
                                {post?.createdAt.slice(6)}
                            </div>
                            <div className="tagged">
                                {tagEngtoKor(post?.tag)}
                            </div>
                        </div>
                    </div>
                </div>
                {location.pathname.includes(post.id) ? (
                    <>
                        <div className="postContent">{post?.content}</div>
                        {post?.imgUrl && (
                            <div className="imgDiv">
                                <img
                                    src={post?.imgUrl}
                                    alt="postImg"
                                    className="postImg"
                                    width={100}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <Link to={`/posts/${post?.id}`}>
                        <div className="postContent">{post?.content}</div>
                        {post?.imgUrl && (
                            <div className="imgDiv">
                                <img
                                    src={post?.imgUrl}
                                    alt="postImg"
                                    className="postImg"
                                    width={100}
                                />
                            </div>
                        )}
                    </Link>
                )}
            </div>
            <div className="postFooter">
                {user?.uid === post?.uid && (
                    <>
                        <ButtonStyle2
                            type="button"
                            className="postDelete"
                            onClick={handleDelete}
                        >
                            삭제
                        </ButtonStyle2>
                        <ButtonStyle2 type="button" className="postEdit">
                            <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                        </ButtonStyle2>
                    </>
                )}

                <ButtonStyle2
                    type="button"
                    className="postLike"
                    onClick={toggleLike}
                >
                    {user?.uid && post?.likes?.includes(user.uid) ? (
                        <AiFillHeart />
                    ) : (
                        <AiOutlineHeart />
                    )}
                    {post?.likeCount || 0}
                </ButtonStyle2>
                <Link to={`/posts/${post?.id}`}>
                    <ButtonStyle2 type="button" className="postComments">
                        <FaRegComment />
                        {post?.comments?.length || 0}
                    </ButtonStyle2>
                </Link>
            </div>
        </PostBoxStyle>
    );
}
