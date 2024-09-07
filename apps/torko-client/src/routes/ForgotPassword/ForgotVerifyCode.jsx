import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const sendCodeForVerification = async (body) => {
    // console.log("Code", code)
    const response = await fetch(`${import.meta.env.VITE_API_POST_SIGNUP2}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (response.ok) return responseData;

    
    throw new Error(responseData.error);
};

export default function ForgotVerifyCode() {
    const [email, setEmail] = React.useState("");
    const [code, setCode] = React.useState("");

    React.useEffect(() => {
        let localEmail = localStorage.getItem("emailForVerification")
        setEmail(localEmail)
    }, [])

    const navigateTo = useNavigate();
    const { mutate, isPending, error, data } = useMutation({
        mutationFn: sendCodeForVerification,
        onSuccess: (data) => {
            localStorage.setItem("temporaryToken", data.temporaryToken)
            navigateTo("/forgot-password/2");
        },
        onError: (error) => {
            console.error(error)
        },
    });

    const handleSubmit = async () => {
        if (!code || isPending) return;
        mutate({email, code})
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
                <div className="forgot-messages">Code?</div>
                <hr style={{margin: "15px 0"}} />
                <input
                    disabled={isPending}
                    type="text"
                    placeholder="Enter the code we sent you"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
