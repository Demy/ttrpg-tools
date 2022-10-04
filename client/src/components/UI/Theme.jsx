import React from "react";
import { ThemeProvider } from "styled-components";

export const theme = {
  colors: {
    primary: "#985277",
    primaryDark: "#5c374c",
    primaryLight: "#ce6a85",
    secondary: "#ff8c61",
    secondaryLight: "#faa275",
    textAccent: '#fff',
    textDefault: '#000',
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  }
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
