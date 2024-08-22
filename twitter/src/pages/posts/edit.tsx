import {
    ButtonStyle,
    DropdownStyle,
    InputStyle,
    TopTitle,
} from "@/component/Style";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "../home";
import { IoIosArrowBack } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { EditFormStyle } from "./postEditStyle";
import { toast } from "react-toastify";

const FetchPost = async (paramsId: string | undefined) => {
    if (paramsId) {
        try {
            const docRef = doc(db, "posts", paramsId);
            const postSnap = await getDoc(docRef);
            const data = { ...postSnap?.data(), id: paramsId } as PostProps;
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    } else {
        throw new Error("사용자 UID가 존재하지 않습니다.");
    }
};

export default function PostEdit() {
    const params = useParams();
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const [content, setContent] = useState<string | undefined>("");
    const [imgUrl, setImgUrl] = useState<string | undefined>("");
    const [tag, setTag] = useState<string | undefined>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const {
            target: { name, value },
        } = e;
        if (name === "postMsg") {
            setContent(value);
        }
        if (name === "imgUrl") {
            setImgUrl(value);
        }
        if (name === "tag") {
            setTag(value);
        }
    };

    //받아오는 부분
    useQuery(["postData", params.id], () => FetchPost(params.id), {
        onSuccess: (thisData) => {
            setContent(thisData?.content);
            setImgUrl(thisData?.imgUrl);
            setTag(thisData?.tag);
        },
    });

    //제출
    const postEdit = useMutation(async () => {
        if (params.id) {
            try {
                setIsSubmitting(true);
                const postRef = doc(db, "posts", params?.id);
                await updateDoc(postRef, {
                    content: content,
                    tag: tag,
                    imgUrl: imgUrl,
                });
                setContent("");
                setImgUrl("");
                setTag("");
                navigate(`/posts/${params?.id}`);
                toast.success("게시 글을 수정했습니다");
            } catch (error) {
                console.log(error);
            }
            setIsSubmitting(false);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (content === "") {
            toast.warn("내용을 입력하세요");
        } else {
            postEdit.mutate();
        }
    };

    return (
        <EditFormStyle onSubmit={handleSubmit}>
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate(-1)}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
                </div>
            </TopTitle>
            <div className="inputArea">
                <textarea
                    name="postMsg"
                    id="postMsg"
                    placeholder="메시지를 입력해 주세요"
                    value={content}
                    onChange={handleChange}
                />
            </div>
            <div className="submitArea">
                <div className="dropBox">
                    <DropdownStyle
                        height="100%"
                        fontFamily="nexonGothic"
                        name="tag"
                        value={tag}
                        onChange={handleChange}
                    >
                        {user?.uid === "u0UydTfRHnNPFjydNSHS1xqcScI2" && (
                            <option value="notice">공지</option>
                        )}
                        <option value="talk">사담</option>
                        <option value="share">정보</option>
                        <option value="hotlink">긴급</option>
                    </DropdownStyle>
                </div>
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
        </EditFormStyle>
    );
}
