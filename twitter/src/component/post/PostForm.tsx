import { useState } from "react";
import { ButtonStyle, DropdownStyle, InputStyle } from "../Style";
import { FormWrapStyle } from "./PostStyle";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { useMutation } from "react-query";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { toast } from "react-toastify";

export default function PostForm() {
    const user = useRecoilValue(userState);
    const [content, setContent] = useState<string>("");
    const [hashTag, setHashTag] = useState<string>("notice");
    const [imgUrl, setImgUrl] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    //입력
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        if (name === "postMsg") {
            setContent(value);
        }
        if (name === "hashtag") {
            setHashTag(value);
        }
        if (name === "imgUrl") {
            setImgUrl(value);
        }
    };

    //제출
    const postSend = useMutation(async () => {
        try {
            setIsSubmitting(true);
            await addDoc(collection(db, "posts"), {
                content: content,
                createdAt: new Date()?.toLocaleDateString("ko", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
                uid: user?.uid,
                hashTag: hashTag,
                imgUrl: imgUrl,
                profileUrl: user?.photoURL,
            });
            setContent("");
            setHashTag("notice");
            setImgUrl("");
            toast.success("게시글을 생성했습니다");
        } catch (error) {
            console.log(error);
        }
        setIsSubmitting(false);
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (content === "") {
            toast.warn("내용을 입력하세요");
        } else {
            postSend.mutate();
        }
    };

    return (
        <FormWrapStyle onSubmit={handleSubmit}>
            <textarea
                name="postMsg"
                id="postMsg"
                placeholder="메시지를 입력해 주세요"
                value={content}
                onChange={handleChange}
            />
            <div className="hashTags">
                <div className="selectBox">
                    <DropdownStyle
                        value={hashTag}
                        name="hashtag"
                        id="hashtag"
                        height="100%"
                        fontFamily="nexonGothic"
                        onChange={handleChange}
                    >
                        <option value="notice">공지</option>
                        <option value="share">공유</option>
                        <option value="talk">사담</option>
                    </DropdownStyle>
                </div>
                <div className="inputBox">
                    <InputStyle
                        value={imgUrl}
                        name="imgUrl"
                        id="imgUrl"
                        type="text"
                        placeholder="이미지 주소 입력"
                        fontSize="13px"
                        fontFamily="nexonGothic"
                        height="100%"
                        border="none"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="submitArea">
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
        </FormWrapStyle>
    );
}