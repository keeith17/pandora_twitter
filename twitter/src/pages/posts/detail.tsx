import { TopTitle } from "@/component/Style";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "../home";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useQuery } from "react-query";
import { PostBox } from "@/component/post/PostBox";
import { IoIosArrowBack } from "react-icons/io";
import CommentForm from "@/component/comment/commentForm";
import { CommentBox, CommentProps } from "@/component/comment/commentBox";
import { NothingStyle } from "./postEditStyle";

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
export default function PostDetail() {
    const params = useParams();
    const navigate = useNavigate();
    const { data: herepost } = useQuery(["postData", params.id], () =>
        FetchPost(params.id)
    );
    return (
        <div>
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate(-1)}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
                </div>
            </TopTitle>
            {herepost?.content ? (
                <>
                    <PostBox post={herepost} />
                    <CommentForm post={herepost} />
                    {herepost?.comments &&
                        herepost.comments
                            .slice(0)
                            .reverse()
                            .map((comment: CommentProps, index: number) => (
                                <CommentBox
                                    comment={comment}
                                    key={index}
                                    post={herepost}
                                />
                            ))}
                </>
            ) : (
                <NothingStyle>
                    해당하는 게시 글이 존재하지 않습니다.
                </NothingStyle>
            )}
        </div>
    );
}
