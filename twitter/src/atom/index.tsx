import { app } from "@/firebaseApp";
import { getAuth } from "firebase/auth";
import { atom } from "recoil";
const auth = getAuth(app);

export interface authUserProps {
    uid: string | null;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export const userState = atom<authUserProps>({
    key: "userState",
    default: { uid: null, email: null, displayName: null, photoURL: null },
});

export const initState = atom<boolean>({
    key: "initState",
    default: false,
});

export const authState = atom<boolean>({
    key: "authState",
    default: !!auth?.currentUser,
});
