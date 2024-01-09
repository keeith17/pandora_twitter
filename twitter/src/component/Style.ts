import { borderColor } from "@/GlobalStyle";
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
    height: 5%;
    position: sticky;
    max-width: 600px;
    margin: 0 auto;
    top: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${borderColor};
    .title {
        background: transparent;
        width: 100%;
        padding: 0 16px;
        font-weight: 700;
        font-size: 20px;
        .text {
            width: 100%;
        }
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
    }
    &::placeholder {
        color: #fff;
    }
`;

export const DropdownStyle = styled.select<DropdownProps>`
    width: 100%;
    height: ${(props) => props.height};
    font-family: ${(props) => props.fontFamily};
    // background: transparent;
    // border: 1px solid #fff;
    background-color: transparent;
    border: none;
    border-radius: 3px;
    caret-color: #fff;
    color: #fff;
    text-indent: 5px;
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
    &:hover {
        background: transparent;
    }
`;
