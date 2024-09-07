import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

export default function BackupEmailAndPassword() {
    const navigateTo = useNavigate();

    const handleSubmit = async () => {
        localStorage.removeItem("temporaryToken")
        localStorage.removeItem("emailForVerification")
        navigateTo('/')
    };


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
                <div className="prangon-logo">Welcome to <span className="prangon-logo">Prangon</span></div>
                <hr />
                
                <p>Together, we can do greater things!</p>

                <button onClick={handleSubmit}>{"Login"}</button>
            </Box>
        </Container>
    );
}
