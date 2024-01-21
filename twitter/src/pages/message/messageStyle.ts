import { borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

const windowHeight = window.innerHeight;
export const NewMessageStyle = styled.div`
    width: 100%;
    height: calc(${windowHeight}px - 51px);
    position: relative;
    .content {
        width: 100%;
        height: calc(100% - 45px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .sendTo {
            width: 100%;
            height: 50px;
            padding: 5px 15px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid ${borderColor};
            .text {
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
            }
            .selectedName {
                border: 1px solid ${borderColor};
                border-radius: 20px;
                padding: 7px 12px;
                display: flex;
                gap: 3px;
            }
            .inputBox {
                width: 80%;
                height: 100%;
                position: relative;
                input {
                    text-indent: 0;
                    font-size: 14px;
                    &:focus {
                        border: none;
                    }
                }
                .memberList {
                    width: 100%;
                    position: absolute;
                    top: 50px;
                    display: flex;
                    flex-flow: wrap;
                    gap: 2px;
                    button {
                        width: calc(50% - 2px);
                        height: 40px;
                        display: flex;
                        gap: 0.5rem;
                        align-items: center;
                        padding: 0 0.5rem;
                        border: none;
                        background: rgba(255, 255, 255, 0.03);
                        cursor: pointer;
                        img {
                            padding: 0.1rem;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
`;

export const ChatWrapStyle = styled.div`
    width: 100%;
    height: calc(${windowHeight}px - 51px);
    position: relative;
    .messages {
        width: 100%;
        height: calc(100% - 155px);
        overflow-y: scroll;
        padding: 10px;
        .buttonBox {
            padding: 5px 0;
            button {
                padding: 3px 0;
            }
        }
    }
`;

export const SendTextStyle = styled.div`
    width: 100%;
    height: 110px;
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    .textArea {
        width: 100%;
        height: 100%;
        position: relative;
        textarea {
            width: 100%;
            height: 100%;
            background: transparent;
            resize: none;
            border: 1px solid ${borderColor};
            border-radius: 5px;
            outline: none;
            caret-color: ${borderColor};
            color: #fff;
            padding: 10px;
            font-size: 15px;
            font-family: "nexonGothic";
        }
        button {
            position: absolute;
            bottom: 10px;
            right: 10px;
            border: none;
            padding: 3px;
        }
    }
`;

export const MessageWrapStyle = styled.div`
    width: 100%;
    height: calc(${windowHeight}px - 51px);
    .chatRoomList {
        width: 100%;
        height: calc(100% - 45px);
        overflow-y: scroll;
    }
`;
