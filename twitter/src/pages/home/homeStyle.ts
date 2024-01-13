import { borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const HomeWrap = styled.div`
    width: 100%;
`;

export const PostWrap = styled.div`
    width: 100%;
    padding-bottom: 51px;
    .moreBtn {
        height: 40px;
        background: transparent;
        border: none;
    }
`;

export const HomeTabs = styled.div`
    background: transparent;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .homeTab {
        background: transparent;
        text-align: center;
        font-weight: 500;
        padding: 16px;
        cursor: pointer;
        &.tabActive {
            font-weight: 700;
            border-bottom: 2px solid ${borderColor};
        }
    }
`;
