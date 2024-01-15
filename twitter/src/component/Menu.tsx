import { userState } from "@/atom";
import { app } from "@/firebaseApp";
import styled from "@emotion/styled";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { BsHouse } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout, MdLogin, MdOutlineMessage } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { backgroundColor, borderColor } from "@/GlobalStyle";

const FooterStyle = styled.div`
    position: fixed;
    bottom: 0;
    z-index: 5;
    width: 100%;
    max-width: 598px;
    margin: 0 auto;
    background: transparent;
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        background: transparent;
        .text {
            background: transparent;
        }
        button {
            width: 100%;
            border: none;
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;
            border-top: 2px solid ${backgroundColor};
            font-size: 15px;
            font-family: "nexonGothic";
            background: transparent;
            padding: 14px 0;
            backdrop-filter: blur(10px);
            cursor: pointer;
            &.select {
                border-top: 2px solid ${borderColor};
            }
            svg {
                background: transparent;
            }
        }
    }
`;

export default function MenuList() {
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <FooterStyle>
            <div className="grid">
                <button
                    type="button"
                    className={location.pathname === "/" ? "select" : ""}
                    onClick={() => navigate("/")}
                >
                    <BsHouse size={21} />
                </button>
                <button
                    type="button"
                    className={location.pathname === "/profile" ? "select" : ""}
                    onClick={() => navigate("/profile")}
                >
                    <FaUserCircle size={21} />
                </button>
                <button
                    type="button"
                    className={location.pathname === "/message" ? "select" : ""}
                    onClick={() => navigate("/message")}
                >
                    <MdOutlineMessage size={21} />
                </button>
                <button
                    type="button"
                    className={
                        location.pathname === "/notifications" ? "select" : ""
                    }
                    onClick={() => navigate("/notifications")}
                >
                    <IoMdNotificationsOutline size={21} />
                </button>
                {user === null ? (
                    <button
                        type="button"
                        className={
                            location.pathname === "/login" ? "select" : ""
                        }
                        onClick={() => navigate("/")}
                    >
                        <MdLogin size={21} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={async () => {
                            const auth = getAuth(app);
                            await signOut(auth);
                            toast.success("로그아웃 되었습니다");
                        }}
                    >
                        <MdLogout size={21} />
                    </button>
                )}
            </div>
        </FooterStyle>
    );
}
