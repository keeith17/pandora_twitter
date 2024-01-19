import { borderColor, danger, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const ChatRoomWrap = styled.div`
    width: 100%;
    height: 80px;
    padding: 10px;
    border-bottom: 1px solid ${borderColor};
    display: grid;
    grid-template-columns: 50px calc(100% - 50px);
    cursor: pointer;
    .partnerPhoto {
        width: 100%;
        display: flex;
        align-items: center;
        img {
            width: 100%;
            border-radius: 50%;
        }
    }
    .chatInfo {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 7px 14px;
        position: relative;
        .partner {
            width: 100%;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .partnerNick {
            }
            .lastTime {
                font-weight: normal;
                font-size: 13px;
                color: ${grayText};
            }
        }
        .lastMessage {
            width: 100%;
            padding-right: 20px;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
        }
        .newCount {
            font-size: 13px;
            width: 20px;
            height: 20px;
            display: flex;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: 7px;
            right: 7px;
            background: ${danger};
        }
    }
`;

export const MessageBoxStyle = styled.div`
    width: 100%;
    padding: 3px 0;
    display: flex;
    &.mine {
        justify-content: flex-end;
        .balloon {
            background: ${borderColor};
        }
    }
    &.yours {
        justify-content: flex-start;
        .balloon {
            background: transparent;
        }
    }
    .balloon {
        padding: 5px 10px;
        border-radius: 15px;
        border: 2px solid ${borderColor};
    }
`;
