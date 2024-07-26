import { activeColor, danger } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const NotiBoxWrap = styled.div`
    width: 100%;
    padding: 8px 16px;
    border-bottom: 1px solid $border;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    &:hover {
        font-weight: 600;
    }
    .contentBox {
        width: 95%;
        .createdAt {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .when {
                color: $grayText;
                font-size: 12px;
                margin-bottom: 4px;
            }
        }
        .checkRead {
            width: 100%;
            display: flex;
            position: relative;
            .content {
                width: 100%;
            }
            .unread {
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: ${activeColor};
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
    .btnBox {
        width: 5%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .delButton {
            border: none;
            outline: none;
            font-size: 16px;
            color: #fff;
        }
    }
`;
