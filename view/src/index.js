import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./scenes/auth/authContext";
import {DataProvider} from './components/dataContext.jsx';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <DataProvider>
      <App />
    </DataProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
