import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../../hooks/useLogin";

export default function Home() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { login, isLoading, error } = useLogin();
    const navigateTo = useNavigate;

    const handleSignIn = () => {
        if (isLoading) return;
        login(email, password);
    };

    return (
        <>
            <div className="main">
                <h1 className="text-wrapper">
                    Built for{" "}
                    <span className="text-highlight-wrapper">healthy</span>{" "}
                    debate.
                </h1>
                <div className="card-wrapper">
                    <div className={"outline rotate1"}></div>
                    <div className={"outline rotate2"}></div>
                    <div className={"outline rotate3"}></div>
                    <div className={"outline rotate4"}></div>
                    <div className={"outline rotate5"}></div>
                    <div className={"card"}>
                        <div className="prangon-logo">Bitorko</div>

                        <hr />
                        <label htmlFor="email">BracU Email</label>
                        <input
                            type="text"
                            id="user"
                            placeholder="Enter your BracU email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="*******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p style={{ paddingTop: "10px", color: "red" }}>
                                {error}
                            </p>
                        )}
                        <button onClick={handleSignIn}>
                            {isLoading ? "Loading..." : "Sign In"}
                        </button>
                    </div>
                </div>
            </div>
            <footer>
                <div>
                    <p>
                        Verion 1.0.1{" "}
                        <span style={{ fontFamily: "Rubik Bubbles" }}>
                            Prangon Community App Platform
                        </span>{" "}
                        <a
                            href="signup"
                            style={{
                                color: "inherit",
                                textDecoration: "underline",
                            }}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );
}
