import { borderColor, danger, grayDark, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const FormWrapStyle = styled.form`
    width: 100%;
    textarea {
        width: 100%;
        height: 120px;
        background: transparent;
        font-family: "nexonGothic";
        font-size: 20px;
        color: #fff;
        padding: 16px;
        border: none;
        resize: none;
        outline: none;
        border-bottom: 1px solid ${borderColor};
        caret-color: #fff;
        &::placeholder {
            font-family: "nexonGothic";
            color: ${grayText};
        }
    }
    .hashTags {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        .selectBox {
            width: 30%;
        }
        .inputBox {
            width: 70%;
        }
    }
    .submitArea {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid ${borderColor};
        display: flex;
        padding: 3px;
        justify-content: flex-end;
        .buttonBox {
            width: 20%;
        }
    }
`;

export const PostBoxStyle = styled.div`
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid ${borderColor};
    .profile {
        padding: 0 10px;
        .postFlex {
            display: flex;
            gap: 4px;
            align-items: center;

            .img,
            .icon {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                margin-right: 10px;
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
        a {
            color: #fff;
            .postContent {
                display: block;
                font-weight: 500;
                padding: 16px 4px;
                .imgDiv {
                    padding: 10px;
                }
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
