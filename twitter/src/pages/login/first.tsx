import { ButtonStyle, InputStyle, TopTitle } from "@/component/Style";
import { FirstForm, FirstWrap } from "./loginStyle";
import { useState } from "react";
import { FiImage } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { db, storage } from "@/firebaseApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useMutation } from "react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Loader from "@/component/loader/Loader";

export const PROFILE_DEFAULT_URL = "/images/null.webp";

export default function FirstPage() {
    const user = useRecoilValue(userState);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [charname, setCharname] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);

    //이미지 등록
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = e;

        // 파일이 선택되지 않았을 경우 예외 처리
        if (!files || files.length === 0) {
            console.error("No file selected");
            return;
        }

        const file = files[0];
        const fileReader = new FileReader();

        fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
            const result = (e.target as FileReader).result;

            // result가 문자열인지 확인
            if (result && typeof result === "string") {
                setImageUrl(result);
            } else {
                console.error("Invalid result type");
            }
        };

        // readAsDataURL 호출
        fileReader.readAsDataURL(file);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "charname") {
            setCharname(value);
        }
        if (name === "nickname") {
            setNickname(value);
        }
    };
    const { mutate: submit, isLoading } = useMutation(
        async () => {
            const key = `${user?.uid}/${uuidv4()}`;
            const storageRef = ref(storage, key);
            let newImageUrl = "/images/null.webp";
            if (imageUrl) {
                const data = await uploadString(
                    storageRef,
                    imageUrl,
                    "data_url"
                );
                newImageUrl = await getDownloadURL(data?.ref);
            } else {
                newImageUrl = PROFILE_DEFAULT_URL;
            }
            if (user) {
                const twitRef = doc(db, "twiterInfo", user?.uid);
                const charRef = doc(db, "character", user?.uid);
                const charSnap = await getDoc(charRef);
                const charData = {
                    credit: charSnap?.data()?.credit,
                    uid: user.uid,
                };
                if (charData) {
                    await setDoc(twitRef, {
                        charname: charname,
                        nickname: nickname,
                        imageUrl: newImageUrl,
                        credit: charData.credit,
                        leftMsg: 30,
                    });
                } else {
                    await setDoc(twitRef, {
                        charname: charname,
                        nickname: nickname,
                        imageUrl: newImageUrl,
                        credit: 0,
                        leftMsg: 30,
                    });
                }

                await updateProfile(user, {
                    displayName: nickname || null,
                    photoURL: newImageUrl || null,
                });
            }
        },
        {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (error) => {
                console.error("POST 실패:", error);
            },
        }
    );

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit();
    };

    return (
        <FirstWrap>
            <TopTitle>
                <div className="title">
                    <div className="text">FIRST CONNECT</div>
                </div>
            </TopTitle>
            {isLoading && <Loader />}

            <FirstForm onSubmit={onSubmit}>
                <div className="attachment">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="attachment"
                            width={150}
                            height={150}
                        />
                    ) : (
                        <img
                            src={PROFILE_DEFAULT_URL}
                            alt="attachment"
                            width={150}
                            height={150}
                        />
                    )}
                </div>

                <div className="formArea">
                    <div className="inputBox">
                        <div className="inputTitle">이름</div>
                        <InputStyle
                            fontFamily="nexonGothic"
                            fontSize="15px"
                            height="100%"
                            border="none"
                            placeholder="캐릭터 명"
                            name="charname"
                            required
                            onChange={onChange}
                        />
                    </div>
                    <div className="inputBox">
                        <div className="inputTitle">닉네임</div>
                        <InputStyle
                            fontFamily="nexonGothic"
                            fontSize="15px"
                            height="100%"
                            border="none"
                            placeholder="NETWORK 닉네임"
                            name="nickname"
                            required
                            onChange={onChange}
                        />
                    </div>
                    <div className="inputBox">
                        <div className="inputTitle">사진</div>
                        <div className="imageInput">
                            <label className="fileForm" htmlFor="fileInput">
                                <FiImage className="fileIcon" size={20} />
                            </label>
                            <input
                                type="file"
                                name="fileInput"
                                id="fileInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>
                </div>
                <div className="submitArea">
                    <ButtonStyle type="submit" fontSize="15px">
                        제출
                    </ButtonStyle>
                </div>
            </FirstForm>
        </FirstWrap>
    );
}
