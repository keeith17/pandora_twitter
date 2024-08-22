import { borderColor } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const QStyle = styled.div`
    width: 100%;
    form {
        width: 100%;
        .myQ {
            width: 100%;
            height: 12vh;
            padding: 1vh;
            display: flex;
            gap: 1vh;
            .q {
                width: 35%;
                height: 100%;
                border-radius: 8px;

                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2.7vh;
                font-weight: 700;
                position: relative;
                p {
                    position: absolute;
                    top: 2%;
                    left: 2%;
                    font-size: 1.4vh;
                }
            }
            .makeQ {
                width: 65%;
                height: 100%;
                .sendTo {
                    width: 100%;
                    height: 50%;
                    padding: 5px 15px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid ${borderColor};
                    position: relative;
                    z-index: 3;
                    .text {
                        width: 20%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                    }
                    .selectedName {
                        border: none;
                        border-radius: 20px;
                        padding: 7px 12px;
                        display: flex;
                        gap: 3px;
                    }
                    .inputBox {
                        width: 100%;
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
                            top: 90%;
                            display: flex;
                            flex-flow: wrap;
                            gap: 2px;
                            button {
                                width: calc(50% - 2px);
                                height: 30px;
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
                .inputBox2 {
                    width: 100%;
                    height: 50%;
                    position: relative;
                    padding: 5px 15px;
                    display: flex;
                    align-items: center;
                    input {
                        text-indent: 0;
                        font-size: 14px;
                        &:focus {
                            border: none;
                        }
                    }
                }
            }
        }
        .buttonBox {
            width: 100%;
            height: 50px;
            padding: 0 10px 10px 10px;
        }
    }
`;

export const LogList = styled.div`
    width: 100%;
    padding: 1vh;
    border-top: 1px solid ${borderColor};
`;
