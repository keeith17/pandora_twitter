import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { authState, initState, userState } from "@/atom";
import { useSetRecoilState } from "recoil";
import { app } from "@/firebaseApp";

//리액트 쿼리로 바꿔야 함
const AuthManager = () => {
    const auth = getAuth(app);
    const setUser = useSetRecoilState(userState);
    const setIsInit = useSetRecoilState(initState);
    const setIsAuth = useSetRecoilState(authState);

    useEffect(() => {
        const userInfo = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                const { uid, email, displayName, photoURL } = authUser;
                setUser({ uid, email, displayName, photoURL });
                setIsAuth(true);
            } else {
                setUser({
                    uid: null,
                    email: null,
                    displayName: null,
                    photoURL: null,
                });
                setIsAuth(false);
            }
            setIsInit(true);
        });
        return () => {
            userInfo();
        };
    }, [auth, setIsAuth, setIsInit, setUser]);
    return null;
};

export default AuthManager;
