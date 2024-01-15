import { borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const LoginWrap = styled.div`
    width: 100%;
    height: 100vh;
    form {
        width: 70%;
        height: 100%;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        .buttonBox {
            width: 100%;
            height: 55px;
            padding: 10px 0;
        }
    }
`;

export const FirstWrap = styled.div`
    width: 100%;
    height: 100vh;
`;
export const FirstForm = styled.form`
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    gap: 50px;
    align-items: center;
    justify-content: center;
    .attachment {
        img {
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid ${borderColor};
        }
    }
    .formArea {
        width: 70%;
        height: 200px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        position: relative;
        .inputBox {
            width: 100%;
            height: 40px;
            display: flex;
            .inputTitle {
                width: 30%;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid ${borderColor};
            }
            .imageInput {
                width: 70%;
                padding: 10px;
                label {
                    cursor: pointer;
                }
                input[type="file"] {
                    display: none;
                }
            }
            input {
                width: 70%;
                &:focus {
                    border: none;
                }
            }
        }
    }
    .submitArea {
        width: 150px;
        height: 5%;
    }
`;
