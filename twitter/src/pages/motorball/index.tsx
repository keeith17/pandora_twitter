import { TopTitle } from "@/component/Style";
import { MotorballWrap, PrizeRecordWrap } from "./motorballStyle";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseApp";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { userState } from "@/atom";
import { useRecoilValue } from "recoil";
import { QProps } from "@/component/manageQ/QPage";
import { toast } from "react-toastify";
export interface StockProps {
    count: number;
    open: number;
    ship1: number;
    ship2: number;
    ship3: number;
    ship4: number;
    ship5: number;
    get: boolean;
    timestamp: Timestamp;
}
export interface PrizeProps {
    [key: string]: number | string[]; // 문자열 인덱스 추가
    ship1: number;
    ship2: number;
    ship3: number;
    ship4: number;
    ship5: number;
    win: string[] | []; // win을 문자열 배열로 설정
}
export default function MotorballPage() {
    const user = useRecoilValue(userState);
    const queryClient = useQueryClient();
    const shipList = ["ship1", "ship2", "ship3", "ship4", "ship5"];
    const [ship1Val, setShip1Val] = useState<number>(0);
    const [ship2Val, setShip2Val] = useState<number>(0);
    const [ship3Val, setShip3Val] = useState<number>(0);
    const [ship4Val, setShip4Val] = useState<number>(0);
    const [ship5Val, setShip5Val] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Q 자체 페치
    const fetchQ = async () => {
        if (user?.uid) {
            try {
                const Qref = doc(db, "money", user.uid);
                const QSnapshot = await getDoc(Qref);
                const data = {
                    ...QSnapshot?.data(),
                } as QProps;
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    };
    const { data: QInfo } = useQuery("QInfo", fetchQ, {
        staleTime: 20000,
    });

    const fetchStockValue = async () => {
        try {
            // stockValue 컬렉션의 참조 생성
            const stockRef = collection(db, "stockValue");

            // timestamp 기준으로 내림차순 정렬하고, 하나의 문서만 가져오기
            const stockQuery = query(
                stockRef,
                orderBy("timestamp", "desc"),
                limit(1)
            );
            const stockSnapshot = await getDocs(stockQuery);

            // 문서가 존재할 경우 데이터를 추출
            if (!stockSnapshot.empty) {
                const latestStock = stockSnapshot.docs[0].data();
                return latestStock;
            } else {
                console.log("No stock data found.");
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const { data: stockData } = useQuery("stockData", fetchStockValue, {
        staleTime: 20000,
    });
    const fetchPrizeValue = async () => {
        if (user?.uid && stockData) {
            try {
                // stockValue 컬렉션의 참조 생성
                const prizeRef = doc(
                    db,
                    "prize",
                    `open${stockData.open}`,
                    "players",
                    user.uid
                );
                const winRef = doc(db, "prize", `open${stockData.open}`);
                const prizeSnapshot = await getDoc(prizeRef);
                const winSnapshot = await getDoc(winRef);

                if (winSnapshot.exists()) {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: winSnapshot.data().value,
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: winSnapshot.data().value,
                    } as PrizeProps;
                    return data;
                } else {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: [],
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: [],
                    } as PrizeProps;
                    return data;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    const { data: prizeData } = useQuery("prizeData", fetchPrizeValue, {
        staleTime: 20000,
        enabled: !!stockData,
    });
    const beforePrizeValue = async () => {
        if (user?.uid && stockData) {
            try {
                // stockValue 컬렉션의 참조 생성
                const prizeRef = doc(
                    db,
                    "prize",
                    `open${stockData.open - 1}`,
                    "players",
                    user.uid
                );
                const winRef = doc(db, "prize", `open${stockData.open - 1}`);
                const prizeSnapshot = await getDoc(prizeRef);
                const winSnapshot = await getDoc(winRef);
                if (winSnapshot.exists()) {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: winSnapshot.data().value,
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: winSnapshot.data().value,
                    } as PrizeProps;
                    return data;
                } else {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: [],
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: [],
                    } as PrizeProps;
                    return data;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    const { data: beforePrizeData } = useQuery(
        "beforePrizeData",
        beforePrizeValue,
        {
            staleTime: 20000,
            enabled: !!stockData,
        }
    );

    const beforePrizeValue2 = async () => {
        if (user?.uid && stockData) {
            try {
                // stockValue 컬렉션의 참조 생성
                const prizeRef = doc(
                    db,
                    "prize",
                    `open${stockData.open - 2}`,
                    "players",
                    user.uid
                );
                const winRef = doc(db, "prize", `open${stockData.open - 2}`);
                const prizeSnapshot = await getDoc(prizeRef);
                const winSnapshot = await getDoc(winRef);

                if (winSnapshot.exists()) {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: winSnapshot.data().value,
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: winSnapshot.data().value,
                    } as PrizeProps;
                    return data;
                } else {
                    if (!prizeSnapshot.exists()) {
                        return {
                            ship1: 0,
                            ship2: 0,
                            ship3: 0,
                            ship4: 0,
                            ship5: 0,
                            win: [],
                        } as PrizeProps;
                    }
                    const data = {
                        ...prizeSnapshot?.data(),
                        win: [],
                    } as PrizeProps;
                    return data;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    const { data: beforePrizeData2 } = useQuery(
        "beforePrizeData2",
        beforePrizeValue2,
        {
            staleTime: 20000,
            enabled: !!stockData,
        }
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "ship1") {
            setShip1Val(Number(value));
        }
        if (name === "ship2") {
            setShip2Val(Number(value));
        }
        if (name === "ship3") {
            setShip3Val(Number(value));
        }
        if (name === "ship4") {
            setShip4Val(Number(value));
        }
        if (name === "ship5") {
            setShip5Val(Number(value));
        }
    };

    //제출
    const makePurchase = useMutation(async () => {
        if (user?.uid && QInfo && stockData) {
            try {
                setIsSubmitting(true);
                const myMoneyRef = doc(db, "money", user.uid);
                const moneyLogRef = collection(db, "money", user.uid, "log");

                const motorballRef = doc(
                    db,
                    "prize",
                    `open${stockData.open}`,
                    "players",
                    user.uid
                );
                const sendCredit =
                    (ship1Val + ship2Val + ship3Val + ship4Val + ship5Val) *
                    20 *
                    stockData?.count;
                await updateDoc(myMoneyRef, {
                    credit: QInfo.credit - sendCredit,
                });
                await addDoc(moneyLogRef, {
                    log: `모터볼 티켓 구매하여 ${sendCredit}Q 차감됐습니다.`,
                    timeStamp: serverTimestamp(),
                });
                await setDoc(motorballRef, {
                    ship1: prizeData
                        ? Number(prizeData.ship1) + ship1Val
                        : ship1Val,
                    ship2: prizeData
                        ? Number(prizeData.ship2) + ship2Val
                        : ship2Val,
                    ship3: prizeData
                        ? Number(prizeData.ship3) + ship3Val
                        : ship3Val,
                    ship4: prizeData
                        ? Number(prizeData.ship4) + ship4Val
                        : ship4Val,
                    ship5: prizeData
                        ? Number(prizeData.ship5) + ship5Val
                        : ship5Val,
                    get: false,
                });

                toast.success(`성공적으로 구매하였습니다.`);
                setShip1Val(0);
                setShip2Val(0);
                setShip3Val(0);
                setShip4Val(0);
                setShip5Val(0);
            } catch (error) {
                console.log(error);
            }
            await queryClient.invalidateQueries("QInfo");
            await queryClient.invalidateQueries("Qlog");
            await queryClient.invalidateQueries("stockData");
            await queryClient.invalidateQueries("prizeData");
            await queryClient.invalidateQueries("beforePrizeData");
            await queryClient.invalidateQueries("beforePrizeData2");
            setIsSubmitting(false);
        }
    });

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        makePurchase.mutate();
    };

    //이전회차 수령하기 귀찬아서 미친다 진짜
    const getPrizeFunction = useMutation(async () => {
        if (user?.uid && QInfo && stockData && beforePrizeData) {
            try {
                setIsSubmitting(true);
                const myMoneyRef = doc(db, "money", user.uid);
                const moneyLogRef = collection(db, "money", user.uid, "log");
                const getMoney = getCalc(beforePrizeData);

                const motorballRef = doc(
                    db,
                    "prize",
                    `open${stockData.open - 1}`,
                    "players",
                    user.uid
                );

                await updateDoc(myMoneyRef, {
                    credit: QInfo.credit + getMoney,
                });
                await addDoc(moneyLogRef, {
                    log: `모터볼 상금으로 ${getMoney}Q 수령했습니다.`,
                    timeStamp: serverTimestamp(),
                });

                await updateDoc(motorballRef, {
                    get: true,
                });

                toast.success(`성공적으로 수령하였습니다.`);
            } catch (error) {
                console.log(error);
            }
            await queryClient.invalidateQueries("QInfo");
            await queryClient.invalidateQueries("Qlog");
            await queryClient.invalidateQueries("stockData");
            await queryClient.invalidateQueries("prizeData");
            await queryClient.invalidateQueries("beforePrizeData");
            await queryClient.invalidateQueries("beforePrizeData2");
            setIsSubmitting(false);
        }
    });

    const getPrize = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getPrizeFunction.mutate();
    };

    //이전이전 회차 수령하기
    const getPrizeFunction2 = useMutation(async () => {
        if (user?.uid && QInfo && stockData && beforePrizeData2) {
            try {
                setIsSubmitting(true);
                const myMoneyRef = doc(db, "money", user.uid);
                const moneyLogRef = collection(db, "money", user.uid, "log");
                const getMoney = getCalc(beforePrizeData2);

                const motorballRef = doc(
                    db,
                    "prize",
                    `open${stockData.open - 2}`,
                    "players",
                    user.uid
                );

                await updateDoc(myMoneyRef, {
                    credit: QInfo.credit + getMoney,
                });
                await addDoc(moneyLogRef, {
                    log: `모터볼 상금으로 ${getMoney}Q 수령했습니다.`,
                    timeStamp: serverTimestamp(),
                });

                await updateDoc(motorballRef, {
                    get: true,
                });

                toast.success(`성공적으로 수령하였습니다.`);
            } catch (error) {
                console.log(error);
            }
            await queryClient.invalidateQueries("QInfo");
            await queryClient.invalidateQueries("Qlog");
            await queryClient.invalidateQueries("stockData");
            await queryClient.invalidateQueries("prizeData");
            await queryClient.invalidateQueries("beforePrizeData");
            await queryClient.invalidateQueries("beforePrizeData2");
            setIsSubmitting(false);
        }
    });

    const getPrize2 = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getPrizeFunction2.mutate();
    };

    //수령 상금 계산
    const getCalc = (prizeData: PrizeProps) => {
        let total = 0;
        // prizeData.win의 각 항목을 순회
        for (const ship of prizeData.win) {
            if (prizeData[ship] !== undefined) {
                // myData에 해당 항목이 존재하는지 확인
                total +=
                    Number(prizeData[ship]) *
                    Math.round(100 / prizeData.win.length); // 값을 100배해서 합산
            }
        }
        return total;
    };
    return (
        stockData && (
            <MotorballWrap>
                <TopTitle>
                    <div className="title">
                        <div className="text">Motorball</div>
                    </div>
                </TopTitle>
                <div className="players">
                    {shipList.map((ship) => (
                        <div className={`player ${ship}`}>
                            {Array.from({ length: 25 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={
                                        stockData[ship] === index + 1
                                            ? "each selected"
                                            : "each"
                                    }
                                >
                                    {stockData[ship] === index + 1 &&
                                        stockData[ship]}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="cycleInfo">
                        <span className="open">
                            제{stockData?.open} 회 경기{" "}
                        </span>
                        <span className="count">{stockData?.count} 회차</span>
                    </div>
                </div>
                <div className="purchase">
                    <label htmlFor="ship1" className="ship">
                        <div className="color ship1" />
                        <input
                            value={ship1Val}
                            type="number"
                            id="ship1"
                            name="ship1"
                            onChange={onChange}
                        />
                    </label>
                    <label htmlFor="ship2" className="ship">
                        <div className="color ship2" />
                        <input
                            value={ship2Val}
                            type="number"
                            id="ship2"
                            name="ship2"
                            onChange={onChange}
                        />
                    </label>
                    <label htmlFor="ship3" className="ship">
                        <div className="color ship3" />
                        <input
                            value={ship3Val}
                            type="number"
                            id="ship3"
                            name="ship3"
                            onChange={onChange}
                        />
                    </label>
                    <label htmlFor="ship4" className="ship">
                        <div className="color ship4" />
                        <input
                            value={ship4Val}
                            type="number"
                            id="ship4"
                            name="ship4"
                            onChange={onChange}
                        />
                    </label>
                    <label htmlFor="ship5" className="ship">
                        <div className="color ship5" />
                        <input
                            value={ship5Val}
                            type="number"
                            id="ship5"
                            name="ship5"
                            onChange={onChange}
                        />
                    </label>
                </div>
                <div className="purchaseBtn">
                    <p>
                        소지금: {QInfo?.credit}Q 총 구매 금액:{" "}
                        {/* 1회차는 20큐는 해야 대충 밸런스가 맞음 */}
                        {(ship1Val +
                            ship2Val +
                            ship3Val +
                            ship4Val +
                            ship5Val) *
                            20 *
                            stockData?.count}
                        Q
                    </p>
                    {!(
                        stockData.ship1 === 25 ||
                        stockData.ship2 === 25 ||
                        stockData.ship3 === 25 ||
                        stockData.ship4 === 25 ||
                        stockData.ship5 === 25
                    ) && (
                        <button disabled={isSubmitting} onClick={onSubmit}>
                            구입
                        </button>
                    )}
                </div>

                <PrizeRecordWrap>
                    <p>{stockData.open}회 기록</p>
                    {prizeData && (
                        <>
                            <div className="shipsRecord">
                                {shipList.map((ship: string) => (
                                    <div className={`ship ${ship}`} key={ship}>
                                        <div className="color"></div>
                                        <div className="much">
                                            {prizeData[ship]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ship winShip">
                                우승:{" "}
                                {prizeData.win.length > 0 ? (
                                    prizeData.win.map((ship) => (
                                        <div className={`ship ${ship}`}>
                                            <div className="color"></div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="ship">경기 중</div>
                                )}
                            </div>
                            <div className="calc">
                                상금:{" "}
                                {prizeData.win.length === 0
                                    ? "계산 중"
                                    : getCalc(prizeData)}
                            </div>
                        </>
                    )}
                </PrizeRecordWrap>
                <PrizeRecordWrap>
                    <p>{stockData.open - 1}회 기록</p>
                    {beforePrizeData && (
                        <>
                            <div className="shipsRecord">
                                {shipList.map((ship: string) => (
                                    <div className={`ship ${ship}`} key={ship}>
                                        <div className="color"></div>
                                        <div className="much">
                                            {beforePrizeData[ship]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ship winShip">
                                우승:{" "}
                                {beforePrizeData.win.map((ship) => (
                                    <div className={`ship ${ship}`}>
                                        <div className="color"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="calc">
                                상금: {getCalc(beforePrizeData)}
                                {!beforePrizeData.get ? (
                                    <button onClick={getPrize}>수령</button>
                                ) : (
                                    <button disabled>수령 완료</button>
                                )}
                            </div>
                        </>
                    )}
                </PrizeRecordWrap>
                <PrizeRecordWrap>
                    <p>{stockData.open - 2}회 기록</p>
                    {beforePrizeData2 && (
                        <>
                            <div className="shipsRecord">
                                {shipList.map((ship: string) => (
                                    <div className={`ship ${ship}`} key={ship}>
                                        <div className="color"></div>
                                        <div className="much">
                                            {beforePrizeData2[ship]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ship winShip">
                                우승:{" "}
                                {beforePrizeData2.win.map((ship) => (
                                    <div className={`ship ${ship}`}>
                                        <div className="color"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="calc">
                                상금: {getCalc(beforePrizeData2)}
                                {!beforePrizeData2.get ? (
                                    <button onClick={getPrize2}>수령</button>
                                ) : (
                                    <button disabled>수령 완료</button>
                                )}
                            </div>
                        </>
                    )}
                </PrizeRecordWrap>
            </MotorballWrap>
        )
    );
}
