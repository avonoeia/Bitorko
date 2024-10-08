import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const sendEmailForVerification = async (email) => {
    
    const response = await fetch(`${import.meta.env.VITE_API_POST_RESET_PASSWORD1}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
    if (response.ok) return await response.json();
    throw new Error("Email not sent");
};

export default function ForgotEnterEmail() {
    const navigateTo = useNavigate();
    const { userData, setUserData } = useOutletContext();
    const { mutate, isFetching, isPending, error } = useMutation({
        mutationFn: sendEmailForVerification,
        onSuccess: () => {
            localStorage.setItem("emailForVerification", email);
            setUserData((prevData) => {
                return {
                    ...prevData,
                    email,
                };
            });
            navigateTo("/forgot-password/1");
        },
        onError: (error) => {
            console.log("Error in sending email")
            console.error(error);
        },
    });
    const [email, setEmail] = React.useState("");

    const handleSubmit = async () => {
        if (!email || isPending) return;
        mutate(email)
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
                <div className="forgot-messages">Welcome to the memory hole 😒</div>
                <hr style={{margin: "10px 0"}} />
                <input
                    disabled={isPending}
                    type="text"
                    placeholder="Enter your BracU email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {error && (
                    <Typography variant="body1" sx={{ pt: 1, color: "error.main" }}>
                        {error.message}
                    </Typography>
                )}
                <button onClick={handleSubmit}>{isPending ? "Loading" : "Next"}</button>
            </Box>
        </Container>
    );
}
