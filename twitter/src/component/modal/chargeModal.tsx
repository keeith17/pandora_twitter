import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ModalWrap } from "./modalStyle";
import { IoCloseOutline } from "react-icons/io5";
import { chargeModalState, myInfoState, userState } from "@/atom";
import { useState } from "react";
import { useMutation } from "react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseApp";
import Loader from "../loader/Loader";
import { ButtonStyle2 } from "../Style";

export function ChargeModal() {
    const user = useRecoilValue(userState);
    const [myInfo, setMyInfo] = useRecoilState(myInfoState);
    const setIsChargeModal = useSetRecoilState(chargeModalState);
    const [selectR, setSelectR] = useState<number>(0);
    const [selectQ, setSelectQ] = useState<number>(0);
    const [confirm, setConfirm] = useState<boolean>(false);

    //결제 (알차감, 문자충전)
    const { mutate: chargeR, isLoading } = useMutation(async () => {
        if (user && myInfo) {
            const twitRef = doc(db, "twiterInfo", user?.uid);
            const charRef = doc(db, "character", user?.uid);
            await updateDoc(twitRef, {
                leftMsg: myInfo?.leftMsg + selectR,
                credit: myInfo?.credit - selectQ,
            });
            await updateDoc(charRef, {
                credit: myInfo?.credit - selectQ,
            });
            setMyInfo({
                ...myInfo,
                leftMsg: myInfo?.leftMsg + selectR,
                credit: myInfo?.credit - selectQ,
            });
        }
        setIsChargeModal(false);
    });
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        chargeR();
    };

    //컨펌 체크
    const handleConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;
        if (value === "on") {
            if (confirm === false) {
                setConfirm(true);
            } else {
                setConfirm(false);
            }
        }
    };

    //모달 닫기
    const handleModalClose = () => {
        setIsChargeModal(false);
    };

    //차감 가격 세팅
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = e;
        if (value === "one") {
            setSelectR(1);
            setSelectQ(10);
        }
        if (value === "thirty") {
            setSelectR(30);
            setSelectQ(290);
        }
        if (value === "oneH") {
            setSelectR(100);
            setSelectQ(900);
        }
        if (value === "twoH") {
            setSelectR(200);
            setSelectQ(1700);
        }
    };

    //정산 후 금액 계산
    const calcLeftCredit = (myCredit: number, total: number) => {
        return myCredit - total;
    };
    return (
        <ModalWrap>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="modalContent">
                    <div className="myInfo">
                        <div className="infoQR">
                            Q: {myInfo?.credit} R: {myInfo?.leftMsg}
                        </div>
                        <ButtonStyle2 onClick={handleModalClose}>
                            <IoCloseOutline size={30} />
                        </ButtonStyle2>
                    </div>
                    <div className="QRtitle">
                        <div className="Rtitle">충전 R</div>
                        <div className="Qtitle">금액 Q</div>
                    </div>
                    <ul className="selectR">
                        <li>
                            <label>
                                <div className="inputBox">
                                    <input
                                        type="radio"
                                        name="selectR"
                                        value="one"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="getR">1R</div>
                                <div className="payQ">10Q</div>
                            </label>
                        </li>
                        <li>
                            <label>
                                <div className="inputBox">
                                    <input
                                        type="radio"
                                        name="selectR"
                                        value="thirty"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="getR">30R</div>
                                <div className="payQ">290Q</div>
                            </label>
                        </li>
                        <li>
                            <label>
                                <div className="inputBox">
                                    <input
                                        type="radio"
                                        name="selectR"
                                        value="oneH"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="getR">100R</div>
                                <div className="payQ">900Q</div>
                            </label>
                        </li>
                        <li>
                            <label>
                                <div className="inputBox">
                                    <input
                                        type="radio"
                                        name="selectR"
                                        value="twoH"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="getR">200R</div>
                                <div className="payQ">1700Q</div>
                            </label>
                        </li>
                    </ul>
                    <div className="calc">
                        <div className="priceInfo">
                            <p>
                                {myInfo?.credit}Q{" "}
                                <span className="subInfo">현재 소지 금액</span>
                            </p>
                            -
                            <p>
                                {selectQ}Q
                                <span className="subInfo">충전 금액</span>
                            </p>
                            =
                            <p className="result">
                                {calcLeftCredit(myInfo?.credit || 0, selectQ)}Q
                            </p>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="confirm">
                            <label>
                                <input
                                    type="checkbox"
                                    name="confirm"
                                    onChange={handleConfirm}
                                    checked={confirm}
                                />
                                <span>충전 후 환불은 불가능합니다</span>
                            </label>
                        </div>
                        <ButtonStyle2
                            disabled={
                                calcLeftCredit(myInfo?.credit || 0, selectQ) <
                                    0 || !confirm
                            }
                            onClick={handleSubmit}
                        >
                            충전하기
                        </ButtonStyle2>
                    </div>
                </div>
            )}
        </ModalWrap>
    );
}
