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
        padding: 10px;
        border: 3px solid ${backgroundColor};
        border-radius: 10px;
        background: ${borderColor};
        .myInfo {
            width: 100%;
            height: 10%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid ${backgroundColor};
            position: relative;
            .infoQR {
                font-size: 20px;
                font-weight: 600;
            }
            button {
                padding: 0;
                position: absolute;
                top: 0;
                right: 0;
            }
        }
        .QRtitle {
            width: 100%;
            height: 10%;
            display: flex;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.6);
            .Rtitle {
                width: 50%;
            }
            .Qtitle {
                width: 50%;
            }
        }
        .selectR {
            width: 100%;
            height: 40%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.6);
            li {
                width: 100%;
                height: 25%;
                label {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    gap: 10px;
                    position: relative;
                    .inputBox {
                        height: 20px;
                        position: absolute;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        top: calc(50% - 10px);
                        left: 10px;
                        input {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border: 2px solid rgba(255, 255, 255, 0.6);
                            border-radius: 50%;
                            &:checked {
                                border: 7px solid ${backgroundColor};
                            }
                        }
                    }
                    .getR {
                        width: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .payQ {
                        width: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
        .calc {
            width: 100%;
            height: 20%;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            .priceInfo {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 25px;
                p {
                    font-size: 25px;
                    padding: 0 15px;
                    position: relative;
                    &.result {
                        font-weight: 600;
                    }
                    .subInfo {
                        position: absolute;
                        top: -12px;
                        left: 15px;
                        display: block;
                        font-size: 12px;
                    }
                }
            }
        }
        .bottom {
            width: 100%;
            height: 20%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: 15px;
            .confirm {
                label {
                    input[type="checkbox"] {
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        border-radius: 3px;
                        &:checked {
                            border: 1px solid rgba(255, 255, 255, 0.6);
                            background: rgba(255, 255, 255, 0.6);
                            position: relative;
                            &::before {
                                content: "✔";
                                width: 16px;
                                height: 16px;
                                display: inline-block;
                                color: ${backgroundColor};
                                position: absolute;
                                top: -2px;
                                left: 2px;
                            }
                        }
                    }
                    span {
                        padding-left: 10px;
                    }
                }
            }
            button {
                border: 1px solid #fff;
                &:disabled {
                    border: 1px solid ${borderColor};
                }
            }
        }
    }
`;
