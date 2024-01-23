import { backgroundColor, borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const ModalWrap = styled.div`
    width: 100%;
    height: 100vh;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    .modalContent {
        width: 90%;
        height: 500px;
        border: 3px solid ${backgroundColor};
        border-radius: 10px;
        background: ${borderColor};
        .myInfo {
            width: 100%;
        }
        .selectR {
            width: 100%;
            li {
                width: 100%;
                label {
                    width: 100%;
                    display: flex;
                    gap: 10px;
                    input {
                        width: 10%;
                    }
                    .getR {
                        width: 45%;
                    }
                    .payQ {
                        width: 45%;
                    }
                }
            }
        }
    }
`;
