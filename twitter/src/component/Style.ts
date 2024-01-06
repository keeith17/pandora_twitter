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

export const TopTitle = styled.div`
    background: transparent;
    backdrop-filter: blur(10px);
    width: 100%;
    position: sticky;
    max-width: 600px;
    margin: 0 auto;
    top: 0;
    .title {
        background: transparent;
        width: calc(100% - 32px);
        padding: 16px;
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

export const ButtonStyle = styled.button<ButtonProps>`
    width: 100%;
    height: 100%;
    background: ${borderColor};
    border: 1px solid ${borderColor};
    border-radius: 3px;
    color: #fff;
    font-size: ${(props) => props.fontSize};
    transition: all 0.1s;
    &.selected {
        color: red;
    }
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;
