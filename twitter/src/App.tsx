import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./component/Layout";
import Router from "./component/Router";
import { useRecoilValue } from "recoil";
import { initState } from "./atom";
import Loader from "./component/loader/Loader";

function App() {
    const init = useRecoilValue(initState);
    return (
        <Layout>
            <ToastContainer
                theme="dark"
                autoClose={1000}
                hideProgressBar
                newestOnTop
            />
            {init ? <Router /> : <Loader />}
        </Layout>
    );
}

export default App;
