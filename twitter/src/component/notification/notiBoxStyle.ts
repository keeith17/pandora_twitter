import { activeColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const NotiBoxWrap = styled.div`
    width: 100%;
    padding: 8px 16px;
    border-bottom: 1px solid $border;
    cursor: pointer;
    font-size: 14px;
    &:hover {
        font-weight: 600;
    }
    .createdAt {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .when {
            color: $grayText;
            font-size: 12px;
            margin-bottom: 4px;
        }
        .unread {
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: ${activeColor};
            border-radius: 50%;
        }
    }
    .content {
        width: 100%;
    }
`;
