import { app } from "@/firebaseApp";
import { User, getAuth } from "firebase/auth";
import { atom } from "recoil";
const auth = getAuth(app);

export interface authUserProps {
    uid: string | null;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface twitterInfoProps {
    uid: string;
    charname: string;
    imageUrl: string;
    nickname: string;
}

export const userState = atom<User | null>({
    key: "userState",
    default: null,
    dangerouslyAllowMutability: true,
});

export const initState = atom<boolean>({
    key: "initState",
    default: false,
});

export const authState = atom<boolean>({
    key: "authState",
    default: !!auth?.currentUser,
});

export const twiterInfoState = atom<twitterInfoProps[]>({
    key: "twiterInfoState",
    default: [],
});
