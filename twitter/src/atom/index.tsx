import { app } from "@/firebaseApp";
import { User, getAuth } from "firebase/auth";
import { atom } from "recoil";
const auth = getAuth(app);

export interface twitterInfoProps {
    uid: string;
    charname: string;
    imageUrl: string;
    nickname: string;
    credit: number;
    leftMsg: number;
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

export const myInfoState = atom<twitterInfoProps | null>({
    key: "myInfoState",
    default: null,
});

export const twiterInfoState = atom<twitterInfoProps[]>({
    key: "twiterInfoState",
    default: [],
});

export const chargeModalState = atom<boolean>({
    key: "chargeModalState",
    default: true,
});
