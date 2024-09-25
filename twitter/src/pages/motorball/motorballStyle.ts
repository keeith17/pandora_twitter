import styled from "@emotion/styled";

export const MotorballWrap = styled.div`
    width: 100%;
    .players {
        width: 100%;
        .player {
            width: 100%;
            display: flex;
            .each {
                width: 4%;
                aspect-ratio: 1/2;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3vh;
                font-weight: 700;
                text-shadow: 1px 1px 0 rgba(120, 120, 100, 0.4),
                    /* 오른쪽 아래 */ -1px 1px 0 rgba(120, 120, 100, 0.4),
                    /* 왼쪽 아래 */ 1px -1px 0 rgba(120, 120, 100, 0.4),
                    /* 오른쪽 위 */ -1px -1px 0 rgba(120, 120, 100, 0.4),
                    /* 왼쪽 위 */ 1px 0 0 rgba(120, 120, 100, 0.4),
                    /* 오른쪽 */ -1px 0 0 rgba(120, 120, 100, 0.4),
                    /* 왼쪽 */ 0 1px 0 rgba(120, 120, 100, 0.4),
                    /* 아래쪽 */ 0 -1px 0 rgba(120, 120, 100, 0.4); /* 위쪽 */
            }
            &.ship1 {
                .selected {
                    background: #fa1461;
                }
            }
            &.ship2 {
                .selected {
                    background: #ffe63e;
                }
            }
            &.ship3 {
                .selected {
                    background: #00e53d;
                }
            }
            &.ship4 {
                .selected {
                    background: #0077ff;
                }
            }
            &.ship5 {
                .selected {
                    background: #8b14fa;
                }
            }
        }
        .cycleInfo {
            width: 100%;
            padding: 1.5vh;
            vertical-align: top;
            .open {
                font-size: 2.6vh;
                font-weight: 700;
                vertical-align: bottom;
            }
            .count {
                font-size: 1.9vh;
                vertical-align: bottom;
            }
        }
    }
    .purchase {
        width: 100%;
        padding: 0 2vh;
        display: flex;
        flex-flow: wrap;
        gap: 2vh;
        .ship {
            width: 30%;
            display: flex;
            gap: 1vh;
            .color {
                width: 40%;
                &.ship1 {
                    background: #fa1461;
                }
                &.ship2 {
                    background: #ffe63e;
                }
                &.ship3 {
                    background: #00e53d;
                }
                &.ship4 {
                    background: #0077ff;
                }
                &.ship5 {
                    background: #8b14fa;
                }
            }
            input {
                width: 50%;
                padding: 1vh;
                outline: none;
            }
        }
    }
    .purchaseBtn {
        width: 100%;
        padding: 2vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        button {
            width: 18%;
            padding: 1vh;
            border: none;
            outline: none;
            background: white;
            border-radius: 20px;
            color: black;
            font-weight: 700;
        }
    }
`;

export const PrizeRecordWrap = styled.div`
    width: 100%;
    p {
        width: 100%;
        padding: 1vh 2vh;
        background: rgba(0, 0, 40, 0.4);
        color: white;
        font-size: 1.7vh;
        font-weight: 700;
    }
    .shipsRecord {
        width: 100%;
        padding: 2vh;
        display: flex;
        gap: 5vh;
        flex-flow: wrap;
    }
    .winShip {
        width: 100%;
        padding: 2vh;
        display: flex;
        gap: 1vh;
    }
    .ship {
        display: flex;
        gap: 1vh;
        align-items: center;
        .color {
            height: 3vh;
            aspect-ratio: 1/1;
        }
        &.ship1 {
            .color {
                background: #fa1461;
            }
        }
        &.ship2 {
            .color {
                background: #ffe63e;
            }
        }
        &.ship3 {
            .color {
                background: #00e53d;
            }
        }
        &.ship4 {
            .color {
                background: #0077ff;
            }
        }
        &.ship5 {
            .color {
                background: #8b14fa;
            }
        }
        .much {
            font-size: 2vh;
        }
    }
    .calc {
        width: 100%;
        padding: 2vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        button {
            padding: 0.8vh 1.5vh;
            border: none;
            outline: none;
            background: white;
            color: black;
            border-radius: 20px;
        }
    }
`;
