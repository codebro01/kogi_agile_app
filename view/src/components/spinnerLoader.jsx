import React from "react";

export const SpinnerLoader = () => {
    return <div style={{ ...styles.loader, animation: styles.animation }}></div>;
};

const styles = {
    loader: {
        width: "40px",
        height: "40px",
        border: "1px solid #546e13",
        borderTop: "1px solid transparent",
        borderRadius: "50%",
    },
    animation: "spin 1s linear infinite",
};

// Define the keyframes using the CSSStyleSheet API
const sheet = new CSSStyleSheet();
sheet.insertRule(`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
