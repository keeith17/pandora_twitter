import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthManager from "./recoil/authManager.tsx";
import { RecoilRoot } from "recoil";
import { Global } from "@emotion/react";
import { GlobalStyle } from "./GlobalStyle.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <AuthManager />
            <BrowserRouter>
                <Global styles={GlobalStyle} />
                <App />
            </BrowserRouter>
        </RecoilRoot>
    </QueryClientProvider>
);
