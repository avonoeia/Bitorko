import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import {
    createBrowserRouter,
    RouterProvider,
    redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, teal, yellow } from "@mui/material/colors";
// import { teal } from '@mui/material/colors';
import "./index.css";

// Imported fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Imported routes
import Root, { loader as rootLoader } from "./routes/Root";
import SignupRoot from "./routes/Signup/SignupRoot";
import EnterEmail from "./routes/Signup/EnterEmail";
import VerifyCode from "./routes/Signup/VerifyCode";
import CheckUsername from "./routes/Signup/CheckUsername";
import BackupEmailAndPassword from "./routes/Signup/BackupEmailAndPassword"
import Welcome from "./routes/Signup/Welcome"

import ErrorPage from "./errorPage";
import Home from "./pages/Home/Home";
import Search from "./routes/Search/Search";
import AppIndex from "./routes/AppIndex/AppIndex";
import Post from "./routes/Post/Post";
import PostView from "./routes/Post/PostView"
import UserProfile from "./routes/Profile/UserProfile";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        loader: async () => {
            const user = localStorage.getItem("user");
            if (user) {
                return redirect("/app");
            }
            return true;
        },
    },
    {
        path: "/signup",
        element: <SignupRoot />,
        errorElement: <ErrorPage />,
        loader: async () => {
            const user = localStorage.getItem("user");
            if (user) {
                return redirect("/app");
            }
            return true;
        },
        children: [
            { index: true, element: <EnterEmail /> },
            {
                path: "1",
                element: <VerifyCode />,
            },
            {
                path: "2",
                element: <CheckUsername />,
            },
            {
                path: "3",
                element: <BackupEmailAndPassword />,
            },
            {
                path: "welcome",
                loader: () => {
                    const temporaryToken = localStorage.getItem("temporaryItem")
                    console.log(temporaryToken)
                    if (temporaryToken == null) {
                        console.log("Hello")
                        return redirect('/')
                    }

                    return null
                },
                element: <Welcome />,
            },
        ],
    },
    {
        path: "/app",
        element: <Root />,
        errorElement: <ErrorPage />,
        loader: rootLoader,
        children: [
            { index: true, element: <AppIndex /> },
            {
                path: "post",
                element: <Post />,
            },
            {
                path: "post/:post_id",
                element: <PostView />,
            },
            {
                path: "search",
                element: <Search />,
            },
            {
                path: "profile/:username",
                element: <UserProfile />,
            }
        ],
    },
]);

const theme = createTheme({
    palette: {
        primary: {
            // main: "#79ffb7",
            main: "rgb(30,30,30)",
        },
        secondary: {
            main: "#ebffea",
        },
        shade: {
            main: "1e1e1e",
        },
        error: {
            main: red[500],
        },
        warning: {
            main: red[500],
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </QueryClientProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
