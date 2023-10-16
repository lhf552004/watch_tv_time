import { app } from "./firebase";
import { FirebaseAppProvider } from "reactfire";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Chakra
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import theme from "./theme";

import App from "./App";

const customTheme = extendTheme(theme);

const root = createRoot(document.getElementById("root"));

root.render(
  <FirebaseAppProvider firebaseApp={app}>
    <ChakraProvider resetCSS theme={customTheme}>
      <App />
    </ChakraProvider>
  </FirebaseAppProvider>
);
