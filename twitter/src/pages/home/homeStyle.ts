import { borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const HomeWrap = styled.div`
    width: 100%;
    height: calc(100% - 51px);
`;

export const PostWrap = styled.div`
    width: 100%;
    .moreBtn {
        height: 50px;
        background: transparent;
        border: none;
    }
`;

export const HomeTabs = styled.div`
    background: transparent;
    width: 100%;
    display: flex;
    .homeTab {
        background: transparent;
        text-align: center;
        font-weight: 500;
        color: ${borderColor};
        padding: 16px;
        cursor: pointer;
        &.tabActive {
            font-weight: 700;
            color: #fff;
        }
    }
`;
