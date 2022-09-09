import React, { CSSProperties } from "jsx-dom";

interface ButtonProps {
    style: CSSProperties;
    text: string;
}

export const Button = (testBtnProps: ButtonProps) => {
    const element = document.createElement('button');

    for (const key in testBtnProps.style) {
        (element.style as any)[key] = (testBtnProps.style as any)[key];
    }
    element.innerText = testBtnProps.text;

    return element; 
}
