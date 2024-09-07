import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const finishSignup = async (body) => {
    const response = await fetch(`${import.meta.env.VITE_API_POST_SIGNUP4}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("temporaryToken")}`
        },
        body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (response.ok) return responseData;

    throw new Error(responseData.error);
};

export default function BackupEmailAndPassword() {
    const { userData, setUserData } = useOutletContext();
    const [ passwordConfirmation, setPasswordConfirmation ] = React.useState("");
    const [ passwordMismatch, setPasswordMismatch ] = React.useState(false);
    const navigateTo = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: finishSignup,
        onSuccess: () => {
            navigateTo("/signup/welcome");
        },
        onError: (error) => {
            console.error(error);
        },
    })

    const handleSubmit = async () => {
        if (!userData.personal_email || !userData.password) return;
        mutate(userData);
    };

    function handleChange(event) {
        setUserData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value,
            };
        });
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                height: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                component="section"
                sx={{
                    p: 4,
                    width: "900px",
                    backgroundColor: "#1e1e1e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    borderRadius: "5px",
                }}
            >
                <div className="prangon-logo">Give me your data</div>
                <hr />
                <input
                    type="text"
                    placeholder="Enter a backup email"
                    value={userData.personal_email}
                    name="personal_email"
                    onChange={handleChange}
                    style={{ margin: "5px 0px" }}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={userData.password}
                    name="password"
                    onChange={handleChange}
                    style={{ margin: "5px 0px" }}
                />
                <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={passwordConfirmation}
                    name="confirm_password"
                    onChange={(e) => {
                        setPasswordConfirmation(e.target.value);
                        if (e.target.value !== userData.password)
                            setPasswordMismatch(true);
                        else setPasswordMismatch(false);
                    }}
                    style={{ margin: "5px 0px" }}
                />

                {error && (
                    <Typography
                        variant="body1"
                        sx={{ pt: 1, color: "error.main" }}
                    >
                        {"BracU " + error.message}
                    </Typography>
                )}

                <button onClick={handleSubmit}>{isPending ? "Loading..." : "Next"}</button>
            </Box>
        </Container>
    );
}
