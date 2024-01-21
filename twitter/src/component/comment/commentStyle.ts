import { borderColor, danger, grayDark, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const CommentFormStyle = styled.form`
    width: 100%;
    .inputArea {
        width: 100%;
        border-bottom: 1px solid ${borderColor};
        textarea {
            width: 100%;
            height: 130px;
            background: transparent;
            font-family: "nexonGothic";
            font-size: 20px;
            color: #fff;
            padding: 16px;
            border: none;
            resize: none;
            outline: none;
            caret-color: #fff;
            &::placeholder {
                font-family: "nexonGothic";
                color: ${grayText};
            }
        }
        .inputBox {
            width: 100%;
            height: 40px;
            background: rgba(112, 128, 144, 0.1);
            input {
                &::placeholder {
                    color: ${grayText};
                }
                &:focus {
                    border: none;
                }
            }
        }
    }

    .submitArea {
        width: 100%;
        height: 45px;
        border-bottom: 1px solid ${borderColor};
        display: flex;
        padding: 3px;
        justify-content: space-between;
        .dropBox {
            width: 20%;
            height: 100%;
        }
        .inputBox {
            width: 60%;
            height: 100%;
            input {
                &::placeholder {
                    color: ${grayText};
                }
                &:focus {
                    border: none;
                }
            }
        }
        .buttonBox {
            width: 20%;
            padding: 3px;
        }
    }
`;

export const CommentBoxStyle = styled.div`
    width: 100%;
    padding: 10px 0 10px 25px;
    border-bottom: 1px solid ${borderColor};
    position: relative;
    .commentMark {
        position: absolute;
        top: 15px;
        left: 15px;
    }
    .profile {
        padding: 0 10px;
        .postFlex {
            display: flex;
            gap: 10px;
            align-items: center;

            .img,
            .icon {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }

            .flexBetween {
                display: flex;
                width: 100%;
                justify-content: space-between;
                .email,
                .createdAt {
                    font-size: 12px;
                    color: ${grayText};
                }
                .hashTag {
                    background: transparent;
                    padding: 4px 10px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    .hashTagLine {
                        font-size: 13px;
                        color: #fff;
                        font-weight: 600;
                    }
                }
            }
        }

        .postContent {
            color: #fff;
            display: block;
            font-weight: 500;
            padding: 16px 4px;
            whitespace: "pre-line";
            .imgDiv {
                padding: 10px;
            }
        }
    }
    .postFooter {
        padding: 0 16px;
        margin-top: 10px;
        font-size: 14px;
        display: flex;
        gap: 8px;
        flex-direction: row-reverse;
        .postDelete {
            background: ${danger};
        }
        .postEdit {
            background: ${grayDark};
            a {
                color: #fff;
            }
        }
        .postLike,
        .postComments {
            display: flex;
            gap: 5px;
            align-items: center;
        }
    }
`;
