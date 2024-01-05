import styled from "@emotion/styled";

export default function MenuList() {
    const FooterStyle = styled.div`
        position: fixed;
        bottom: 0;
        z-index: 5;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: transparent;
    `;
    return <FooterStyle>하단</FooterStyle>;
}
