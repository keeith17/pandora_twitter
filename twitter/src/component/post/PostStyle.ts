import { borderColor, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const FormWrapStyle = styled.form`
    width: 100%;
    height: 25%;
    textarea {
        width: 100%;
        height: 64%;
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
        height: 18%;
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
        height: 18%;
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
    height: 200px;
    border-bottom: 1px solid ${borderColor};
`;
