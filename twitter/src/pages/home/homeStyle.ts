import styled from "@emotion/styled";

export const HomeWrap = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
    &::-webkit-scrollbar {
        display: none; /* 크롬, 사파리, 오페라, 엣지 */
    }
`;

export const PostWrap = styled.div`
    width: 100%;
    height: 70%;
    padding-bottom: 51px;
`;
