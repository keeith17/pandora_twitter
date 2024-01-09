import { PostProps } from "@/pages/home";
import { PostBoxStyle } from "./PostStyle";

interface PostBoxProps {
    post: PostProps;
}

export function PostBox({ post }: PostBoxProps) {
    return (
        <PostBoxStyle>
            <div>{post.content}</div>
        </PostBoxStyle>
    );
}
