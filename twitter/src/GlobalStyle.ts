import { css } from "@emotion/react";
import giantsInline from "./assets/fonts/Giants-Inline.ttf";
import nexonGothic from "./assets/fonts/NEXON_Lv2_Gothic_Light.ttf";

export const borderColor = "#708090";
export const backgroundColor = "#1e293b";
export const activeColor = "#7a68a0";
export const grayText = "#9ca3af";
export const danger = "#681313";
export const grayDark = "#3f434d";

export const GlobalStyle = css`
    @font-face {
        font-family: "Giants-Inline";
        src: url(${giantsInline}) format("truetype");
        font-display: swap;
    }
    @font-face {
        font-family: "nexonGothic";
        src: url(${nexonGothic}) format("truetype");
        font-display: swap;
    }

    * {
        margin: 0;
        padding: 0;
        vertical-align: middle;
        box-sizing: border-box;
    }

    html,
    body {
        width: 100%;
        height: 100vh;
    }

    body {
        font-family: "nexonGothic", "Giants-Inline";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: #1e293b;
        color: #ffffff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    ul,
    li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    a {
        color: #333333;
        text-decoration: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-size: 14px;
        font-weight: normal;
    }

    i,
    address,
    em {
        font-style: normal;
    }

    header,
    main,
    footer,
    section,
    nav,
    aside,
    article {
        display: block;
    }

    #root {
        width: 100%;
    }

    button {
        background: transparent;
        cursor: pointer;
        color: #fff;
    }
    video {
        overflow: hidden;
        position: fixed;
        z-index: 0;
    }

    &::-webkit-scrollbar {
        display: none;
        // width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.1);
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;
