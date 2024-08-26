import { app } from "@/firebaseApp";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginWrap } from "./loginStyle";
import { ButtonStyle, InputStyle } from "@/component/Style";
import { borderColor } from "@/GlobalStyle";

export default function LoginPage() {
    const navigate = useNavigate();
    //이메일, 비밀번호 변수
    const [serial, setSerial] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    //입력된 이메일, 비밀번호 값 변경
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "serial") {
            setSerial(value);
        }
        if (name === "password") {
            setPassword(value);
        }
    };
    //로그인
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, serial, password);
            navigate("/");
            toast.success("성공적으로 로그인이 되었습니다.");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <LoginWrap>
            <form onSubmit={onSubmit}>
                <InputStyle
                    type="text"
                    id="serial"
                    name="serial"
                    className="loginInfo"
                    placeholder="ID"
                    fontFamily="nexonGothic"
                    fontSize="13px"
                    border={`1px solid ${borderColor}`}
                    height="50px"
                    onChange={onChange}
                />
                <InputStyle
                    type="password"
                    id="password"
                    name="password"
                    className="loginInfo"
                    placeholder="PASSWORD"
                    fontFamily="nexonGothic"
                    fontSize="13px"
                    border={`1px solid ${borderColor}`}
                    height="50px"
                    onChange={onChange}
                />
                <div className="buttonBox">
                    <ButtonStyle
                        type="submit"
                        className="loginSubmit"
                        fontSize="15px"
                    >
                        로그인
                    </ButtonStyle>
                </div>
            </form>
        </LoginWrap>
    );
}
