import { PostProps } from "@/pages/home";
import { FaUserCircle } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { ButtonStyle2 } from "../Style";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { toast } from "react-toastify";
import { CommentBoxStyle } from "./commentStyle";
import { useQueryClient } from "react-query";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { borderColor } from "@/GlobalStyle";

export interface CommentProps {
    id: string;
    comment: string;
    uid: string;
    email: string;
    createdAt: string;
    profileUrl: string;
    imgUrl: string;
    nickname: string;
}

interface CommentBoxProps {
    comment: CommentProps;
    post: PostProps;
}

export function CommentBox({ comment, post }: CommentBoxProps) {
    const PROFILE_DEFAULT_URL = "/images/seederEdit.webp";
    const user = useRecoilValue(userState);
    const queryClient = useQueryClient();

    //게시 글 삭제
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (post) {
            try {
                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef, {
                    comments: arrayRemove(comment),
                });
                await queryClient.invalidateQueries(["postData", post.id]);
                toast.success("댓글을 삭제하였습니다");
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <CommentBoxStyle>
            <div className="commentMark">
                <MdOutlineSubdirectoryArrowRight
                    size={16}
                    color={`${borderColor}`}
                />
            </div>
            <div className="profile">
                <div className="postFlex">
                    {comment?.profileUrl ? (
                        <div className="imgBox">
                            <img
                                src={
                                    comment.profileUrl
                                        ? comment.profileUrl
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
                                {comment?.nickname
                                    ? comment?.nickname
                                    : "no name"}
                            </div>
                            <div className="createdAt">
                                {comment?.createdAt.slice(6)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="postContent">{comment?.comment}</div>
                {comment?.imgUrl && (
                    <div className="imgDiv">
                        <img
                            src={comment?.imgUrl}
                            alt="postImg"
                            className="postImg"
                            width={100}
                        />
                    </div>
                )}
            </div>
            <div className="postFooter">
                {user?.uid === comment?.uid && (
                    <ButtonStyle2
                        type="button"
                        className="postDelete"
                        onClick={handleDelete}
                    >
                        삭제
                    </ButtonStyle2>
                )}
            </div>
        </CommentBoxStyle>
    );
}
