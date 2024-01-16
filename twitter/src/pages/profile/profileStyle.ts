import { borderColor, grayText } from "@/GlobalStyle";
import styled from "@emotion/styled";

export const Profile = styled.div`
    width: 100%;
    display: flex;
    padding: 0 1rem;
    margin-top: 2.5rem;
    justify-content: space-between;
    align-items: center;
    img {
        border: 3px solid ${borderColor};
        border-radius: 50%;
        width: 100px;
        height: 100px;
    }
    .profileEdit {
        width: 60px;
        height: 30px;
        button {
            border-radius: 50px;
        }
    }
`;

export const ProfileText = styled.div`
    padding: 0 1rem;
    margin-top: 20px;
    .profileName {
        font-size: 16px;
        color: white;
        font-weight: 700;
        margin-bottom: 4px;
    }
    .profileEmail {
        font-size: 14px;
        color: ${grayText};
        margin-bottom: 4px;
    }
`;

export const ProfileTabs = styled.div`
    background: transparent;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .profileTab {
        background: transparent;
        text-align: center;
        font-weight: 500;
        padding: 16px;
        cursor: pointer;
        &.tabActive {
            font-weight: 700;
            border-bottom: 2px solid ${borderColor};
        }
    }
`;

export const ProfileEditStyle = styled.div`
    width: 100%;
`;

export const ProfileEditForm = styled.form`
    width: 100%;
    padding: 16px;
    .editProfile {
        .inputBox {
            width: 100%;
            border-bottom: 1px solid ${borderColor};
            input {
                &:focus {
                    border: none;

                    outline: none;
                }
            }
        }
        .attachment {
            width: 100%;
            padding: 15px 5px;
            display: flex;
            gap: 20px;
            align-items: flex-end;
            border-bottom: 1px solid ${borderColor};
            .buttonBox {
                width: 50px;
                .imageArea {
                    padding-bottom: 10px;
                    label {
                        cursor: pointer;
                    }
                    input[type="file"] {
                        display: none;
                    }
                }
                button {
                    height: 25px;
                }
            }
        }

        .submitArea {
            padding: 15px 5px;
            display: flex;
            justify-content: flex-end;
            .buttonBox {
                width: 60px;
                height: 30px;
            }
        }
    }
`;
