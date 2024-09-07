import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";


const checkUsername = async (body) => {
    const response = await fetch(`${import.meta.env.VITE_API_POST_SIGNUP3}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (response.ok) return responseData;

    console.log("response is", responseData);
    throw new Error(responseData.error);
};

export default function CheckUsername() {
    const { userData, setUserData } = useOutletContext()

    React.useEffect(() => {
        let localEmail = localStorage.getItem("emailForVerification");
        setUserData(prev => ({ ...prev, email: localEmail }));
    }, []);

    const navigateTo = useNavigate();
    const { mutate, isPending, error } = useMutation({
        mutationFn: checkUsername,
        onSuccess: () => {
            navigateTo("/signup/3");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleSubmit = async () => {
        if (!userData.username || !userData.name || isPending) return;
        mutate({ username: userData.username });
    };
    
    function handleChange(event) {
        if (event.target.name == "username") event.target.value = event.target.value.toLowerCase()
        setUserData(prevData => {
            return ({
                ...prevData,
                [event.target.name]: event.target.value 
            })
        })
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
                <div className="prangon-logo">Getting started</div>
                <hr />
                <input
                    disabled={isPending}
                    type="text"
                    placeholder="Full Name"
                    value={userData.name}
                    name="name"
                    onChange={handleChange}
                    style={{margin: "5px 0px"}}
                />
                <input
                    disabled={isPending}
                    type="text"
                    placeholder="Pick a username"
                    value={userData.username}
                    name="username"
                    onChange={handleChange}
                    style={{margin: "5px 0px"}}
                />


                {error && (
                    <Typography
                        variant="body1"
                        sx={{ pt: 1, color: "error.main" }}
                    >
                        {error.message}
                    </Typography>
                )}
                <button onClick={handleSubmit}>
                    {isPending ? "Loading" : "Next"}
                </button>
            </Box>
        </Container>
    );
}
