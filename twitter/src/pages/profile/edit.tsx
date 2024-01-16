import { ButtonStyle, InputStyle, TopTitle } from "@/component/Style";
import { FiImage } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ProfileEditForm, ProfileEditStyle } from "./profileStyle";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom";
import { FaUserCircle } from "react-icons/fa";
import { useMutation } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "@/firebaseApp";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Loader from "@/component/loader/Loader";

export default function ProfileEditPage() {
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    const [displayName, setDisplayName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    console.log(user);
    //사진 교환
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
                setImageChanged(true);
            } else {
                console.error("Invalid result type");
            }
        };

        // readAsDataURL 호출
        fileReader.readAsDataURL(file);
    };

    //사진 삭제
    const handleDeleteImage = () => {
        setImageUrl(null);
        setImageChanged(true);
    };

    // 닉네임 변경
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = e;
        setDisplayName(value);
    };

    const { mutate: submit, isLoading } = useMutation(
        async () => {
            const key = `${user?.uid}/${uuidv4()}`;
            const storageRef = ref(storage, key);
            let newImageUrl = null;
            //이미지 업로드
            if (imageChanged) {
                if (imageUrl) {
                    const data = await uploadString(
                        storageRef,
                        imageUrl,
                        "data_url"
                    );
                    newImageUrl = await getDownloadURL(data?.ref);
                } else {
                    newImageUrl = null;
                }
            } else {
                newImageUrl = user?.photoURL;
            }

            //updateProfile 호출
            if (user) {
                const twitRef = doc(db, "twiterInfo", user?.uid);
                await updateDoc(twitRef, {
                    nickname: displayName,
                    imageUrl: newImageUrl,
                });
                await updateProfile(user, {
                    displayName: displayName,
                    photoURL: newImageUrl,
                });
            }
        },
        {
            onSuccess: () => {
                toast.success("프로필이 업데이트되었습니다");
                navigate("/profile");
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

    //시작하자마자
    useEffect(() => {
        if (user?.photoURL) {
            setImageUrl(user?.photoURL);
        }
        if (user?.displayName) {
            setDisplayName(user?.displayName);
        }
    }, [user?.displayName, user?.photoURL]);

    return (
        <ProfileEditStyle>
            <TopTitle>
                <div className="title">
                    <button type="button" onClick={() => navigate(-1)}>
                        <IoIosArrowBack className="backButton" size={20} />
                    </button>
                </div>
            </TopTitle>
            {isLoading && <Loader />}
            <ProfileEditForm onSubmit={onSubmit}>
                <div className="editProfile">
                    <div className="inputBox">
                        <InputStyle
                            type="text"
                            name="displayName"
                            className="post-form__input"
                            placeholder="NETWORK 닉네임"
                            onChange={onChange}
                            fontSize="14px"
                            fontFamily="nexonGothic"
                            height="30px"
                            border="none"
                            value={displayName}
                        />
                    </div>

                    <div className="attachment">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="attachment"
                                width={120}
                                height={120}
                            />
                        ) : (
                            <FaUserCircle size={120} />
                        )}

                        <div className="buttonBox">
                            <div className="imageArea">
                                <label
                                    className="post-form__file"
                                    htmlFor="fileInput"
                                >
                                    <FiImage size={25} />
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
                            <ButtonStyle
                                type="button"
                                onClick={handleDeleteImage}
                                fontSize="14px"
                            >
                                삭제
                            </ButtonStyle>
                        </div>
                    </div>

                    <div className="submitArea">
                        <div className="buttonBox">
                            <ButtonStyle
                                type="submit"
                                className="post-form__submit-btn"
                                fontSize="14px"
                            >
                                수정
                            </ButtonStyle>
                        </div>
                    </div>
                </div>
            </ProfileEditForm>
        </ProfileEditStyle>
    );
}
