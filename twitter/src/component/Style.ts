import { activeColor, borderColor, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

interface InputProps {
    fontSize: string;
    fontFamily: string;
    height: string;
    border: string;
}

interface ButtonProps {
    fontSize: string;
}

interface DropdownProps {
    height: string;
    fontFamily: string;
}

export const TopTitle = styled.div`
    background: transparent;
    backdrop-filter: blur(10px);
    width: 100%;
    position: sticky;
    max-width: 600px;
    margin: 0 auto;
    top: 0;
    display: flex;
    flex-flow: wrap;
    align-items: center;
    border-bottom: 1px solid ${borderColor};
    .title {
        background: transparent;
        width: 100%;
        padding: 8px 16px;
        font-weight: 700;
        font-size: 20px;
        font-family: "Giants-Inline";
        display: flex;
        justify-content: space-between;
        .text {
            // width: 60%;
        }
        button {
            font-family: "nexonGothic";
            background: transparent;
            height: 28px;
            border: none;
            outline: none;
        }
        .buttons {
            // width: 40%;
            display: flex;
            gap: 15px;
            align-items: center;
            font-family: "nexonGothic";
            font-size: 13px;
            .addMsgCount {
                padding: 0 10px;
                height: 25px;
                border-radius: 7px;
                background: ${borderColor};
            }
            .addNewMsg {
                font-family: "nexonGothic";
                background: transparent;
                height: 28px;
                border: none;
                outline: none;
            }
        }
    }
`;

export const NoTitle = styled.div`
    width: 100%;
    padding: 20px;
    .text {
        width: 100%;
        // border: 1px solid ${borderColor};
        border-radius: 5px;
        padding: 30px;
        text-align: center;
    }
`;

export const InputStyle = styled.input<InputProps>`
    width: 100%;
    height: ${(props) => props.height};
    text-indent: 10px;
    font-size: ${(props) => props.fontSize};
    background: transparent;
    border: ${(props) => props.border};
    border-radius: 3px;
    caret-color: #fff;
    color: #fff;
    font-family: ${(props) => props.fontFamily};
    &:focus {
        outline: none;
        border: 1px solid ${activeColor};
    }
    &::placeholder {
        color: ${grayText};
    }
`;

export const DropdownStyle = styled.select<DropdownProps>`
    width: 100%;
    height: ${(props) => props.height};
    font-family: ${(props) => props.fontFamily};
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    text-align-last: center;
    -ms-text-align-last: center;
    -moz-text-align-last: center;
    text-align: center;
    background: transparent;
    border: none;
    border-radius: 3px;
    caret-color: #fff;
    color: #fff;
    &:focus {
        outline: none;
    }
    option {
        color: #000;
    }
`;

export const ButtonStyle = styled.button<ButtonProps>`
    width: 100%;
    height: 100%;
    background: ${borderColor};
    border: 1px solid ${borderColor};
    border-radius: 3px;
    color: #fff;
    font-family: "nexonGothic";
    font-size: ${(props) => props.fontSize};
    transition: all 0.1s;
    &.selected {
        color: red;
    }
    // &:hover {
    //     background: transparent;
    // }
`;

export const ButtonStyle2 = styled.button`
    padding: 0.2rem 0.8rem;
    border-radius: 50px;
    font-size: 12px;
    line-height: 1.25rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    &:disabled {
        opacity: 0.5;
    }
`;
