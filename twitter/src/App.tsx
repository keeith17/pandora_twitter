import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./component/Layout";
import { useRecoilValue } from "recoil";
import { authState, initState, userState } from "./atom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebaseApp";
import { useState } from "react";

function App() {
    const user = useRecoilValue(userState);
    const isInit = useRecoilValue(initState);
    const isAuth = useRecoilValue(authState);
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
        } catch (error) {
            console.log(error);
        }
    };
    console.log("user", user);
    console.log("init", isInit);
    console.log("auth", isAuth);
    return (
        <Layout>
            <ToastContainer
                theme="dark"
                autoClose={1000}
                hideProgressBar
                newestOnTop
            />
            <div>
                <form onSubmit={onSubmit}>
                    <div className="info">
                        <input
                            type="text"
                            id="serial"
                            name="serial"
                            className="loginInfo"
                            placeholder="ID"
                            onChange={onChange}
                        />
                        <input
                            type="text"
                            id="password"
                            name="password"
                            className="loginInfo"
                            placeholder="PASSWORD"
                            onChange={onChange}
                        />
                    </div>
                    <div className="submit">
                        <button type="submit" className="loginSubmit">
                            로그인
                        </button>
                    </div>
                </form>
                <button
                    type="button"
                    onClick={async () => {
                        const auth = getAuth(app);
                        await signOut(auth);
                    }}
                >
                    Logout
                </button>
                <div>ㅎㅎ</div>
            </div>
        </Layout>
    );
}

export default App;
