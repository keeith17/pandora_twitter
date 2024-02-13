import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./component/Layout";
import Router from "./component/Router";
import { useRecoilValue } from "recoil";
import { initState } from "./atom";
import Loader from "./component/loader/Loader";
import { ReactQueryDevtools } from "react-query/devtools";
import { Global } from "@emotion/react";
import { GlobalStyle } from "./GlobalStyle";

function App() {
    const init = useRecoilValue(initState);
    //test
    return (
        <>
            <Global styles={GlobalStyle} />
            <Layout>
                <ToastContainer
                    theme="dark"
                    autoClose={1000}
                    hideProgressBar
                    newestOnTop
                />
                {init ? <Router /> : <Loader />}
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </>
    );
}

export default App;
