import { authState, userState } from "@/atom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NotificationsPage from "@/pages/notifications";
import PostDetail from "@/pages/posts/detail";
import PostEdit from "@/pages/posts/edit";
import ProfilePage from "@/pages/profile";
import ProfileEditPage from "@/pages/profile/edit";
import { Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import MessagePage from "@/pages/message";
import FirstPage from "@/pages/login/first";

export default function Router() {
    const auth = useRecoilValue(authState);
    const user = useRecoilValue(userState);
    return (
        <Routes>
            {auth ? (
                user?.displayName === null ? (
                    <>
                        <Route path="/login/first" element={<FirstPage />} />
                        <Route
                            path="*"
                            element={<Navigate replace to="/login/first" />}
                        />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/posts/:id" element={<PostDetail />} />
                        <Route path="/posts/edit/:id" element={<PostEdit />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                            path="/profile/edit"
                            element={<ProfileEditPage />}
                        />
                        <Route path="/message" element={<MessagePage />} />
                        <Route
                            path="/notifications"
                            element={<NotificationsPage />}
                        />
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </>
                )
            ) : (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="*"
                        element={<Navigate replace to="/login" />}
                    />
                </>
            )}
        </Routes>
    );
}
