import { authState } from "@/atom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NotificationsPage from "@/pages/notifications";
import PostDetail from "@/pages/posts/detail";
import PostEdit from "@/pages/posts/edit";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function Router() {
    const auth = useRecoilValue(authState);
    return (
        <Routes>
            {auth ? (
                <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/edit/:id" element={<PostEdit />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                    />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </>
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
