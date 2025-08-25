import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider
        theme={{
        token: {
        colorPrimary: "#1677ff",
        borderRadius: 12,
        colorBgLayout: "#f9fafb",
        colorText: "#1f2937",
        colorBorder: "#e5e7eb",
        },
        }}
    >
        <App />
    </ConfigProvider>
);