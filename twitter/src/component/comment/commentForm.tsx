import { useState } from "react";
import { ButtonStyle, InputStyle } from "../Style";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { useMutation, useQueryClient } from "react-query";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseApp";
import { toast } from "react-toastify";
import { CommentFormStyle } from "./commentStyle";
import { PostProps } from "@/pages/home";

export interface CommentFormProps {
    post: PostProps | null;
}

export default function CommentForm({ post }: CommentFormProps) {
    const queryClient = useQueryClient();
    const user = useRecoilValue(userState);
    const [comment, setComment] = useState<string>("");
    const [imgUrl, setImgUrl] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const truncate = (str: string) => {
        return str?.length > 10 ? str?.substring(0, 10) + "..." : str;
    };

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        if (name === "postMsg") {
            setComment(value);
        }
        if (name === "imgUrl") {
            setImgUrl(value);
        }
    };

    const commentSend = useMutation(async () => {
        setIsSubmitting(true);
        if (post && user) {
            try {
                const postRef = doc(db, "posts", post?.id);
                const commentObj = {
                    comment: comment,
                    uid: user?.uid,
                    email: user?.email,
                    profileUrl: user?.photoURL,
                    imgUrl: imgUrl,
                    nickname: user?.displayName,
                    createdAt: new Date()?.toLocaleDateString("ko", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    }),
                };
                await updateDoc(postRef, {
                    comments: arrayUnion(commentObj),
                });

                //댓글 생성 알림 데이터 추가
                if (user?.uid !== post?.uid) {
                    //내 댓글이 아닐 경우에만
                    await addDoc(collection(db, "notifications"), {
                        createdAt: new Date()?.toLocaleDateString("ko", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        }),
                        uid: post?.uid,
                        isRead: false,
                        url: `/posts/${post?.id}`,
                        content: `"${truncate(
                            post?.content
                        )}" 글에 댓글이 작성되었습니다`,
                    });
                }
                await queryClient.invalidateQueries(["postData", post.id]);
                setComment("");
                setImgUrl("");
                toast.success("댓글을 작성했습니다");
            } catch (error) {
                console.log(error);
            }
        }
        setIsSubmitting(false);
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comment === "") {
            toast.warn("내용을 입력하세요");
        } else {
            commentSend.mutate();
        }
    };

    return (
        <CommentFormStyle onSubmit={handleSubmit}>
            <div className="inputArea">
                <textarea
                    name="postMsg"
                    id="postMsg"
                    placeholder="메시지를 입력해 주세요"
                    value={comment}
                    onChange={handleChange}
                />
            </div>
            <div className="submitArea">
                <div className="inputBox">
                    <InputStyle
                        value={imgUrl}
                        name="imgUrl"
                        id="imgUrl"
                        type="text"
                        placeholder="이미지 url"
                        fontSize="13px"
                        fontFamily="nexonGothic"
                        height="100%"
                        border="none"
                        onChange={handleChange}
                    />
                </div>
                <div className="buttonBox">
                    <ButtonStyle
                        type="submit"
                        fontSize="13px"
                        className="post-form__submit-btn"
                        disabled={isSubmitting} //여러번 업로드하지 못하기 위해
                    >
                        작성
                    </ButtonStyle>
                </div>
            </div>
        </CommentFormStyle>
    );
}
