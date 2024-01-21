import { ReactNode } from "react";
import MenuList from "./Menu";
import styled from "@emotion/styled";
import { borderColor } from "@/GlobalStyle";

interface LayoutProps {
    children: ReactNode;
}
const windowHeight = window.innerHeight;
// function setFullHeight() {
//     const windowHeight = window.innerHeight;
//     return windowHeight;
// }
// window.addEventListener("resize", setFullHeight);
const LayoutStyle = styled.div`
    max-width: 600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    border-left: 1px solid ${borderColor};
    border-right: 1px solid ${borderColor};
    min-height: ${windowHeight}px;
    padding-bottom: 51px;
`;
export const Layout = ({ children }: LayoutProps) => {
    return (
        <LayoutStyle>
            {children}
            <MenuList />
        </LayoutStyle>
    );
};
