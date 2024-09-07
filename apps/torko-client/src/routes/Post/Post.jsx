import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";

import Upload from "./Upload";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const createPostRequest = async (body) => {
    let formData = createForm(body.imageFile, body.postText);
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
        `${import.meta.env.VITE_API_POST_CREATE_POST}`,
        {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user.token}`,
            },
            body: formData,
        }
    );
    const responseData = await response.json();
    if (response.ok) return responseData;

    throw new Error(responseData.error);
};

function createForm(imageFile, postText) {
    const formData = new FormData();
    formData.append("post_image_content", imageFile);
    formData.append("post_text_content", postText);
    formData.append(
        "username",
        JSON.parse(localStorage.getItem("user")).username
    );
    return formData;
}

export default function Post() {
    const [image, setImage] = React.useState("");
    const [imageFile, setImageFile] = React.useState("");
    const [postText, setPostText] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const navigateTo = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createPostRequest,
        onSuccess: () => {
            console.log("Post created successfully");
            setSuccess("Posted!");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handlePostSubmission = async () => {
        if (!postText && !imageFile) return;
        if (isPending) return;
        if (success) return;
        mutate({ imageFile, postText });
    };

    React.useEffect(() => {
        if (success) {
            // Setting a 5 second timeout to redirect to the home page
            setTimeout(() => {
                console.log("Check");
                navigateTo("/app");
            }, 3000);
        }
    }, [success]);

    return (
        <>
            <Container sx={{ my: 2 }} maxWidth="sm">
                <Box>
                    <Stack direction="row" spacing={2}>
                        <Avatar alt="Remy Sharp">
                            <PersonIcon color="secondary" />
                        </Avatar>
                        <textarea
                            type="text"
                            placeholder="What's bugging you today?"
                            style={{
                                background: "rgb(30,30,30)",
                                padding: "15px 15px",
                                border: "none",
                                borderRadius: "5px",
                                color: "#ebffea",
                                fontFamily: "Roboto",
                                fontSize: "16px",
                                resize: "none",
                                width: "100%",
                                height: "180px",
                            }}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                    </Stack>
                    <Upload
                        image={image}
                        setImage={setImage}
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                    />
                    {error && (
                        <Typography
                            variant="body1"
                            sx={{ pt: 1, color: "error.main" }}
                        >
                            {error.message}
                        </Typography>
                    )}
                    {
                        <Stack sx={{ mt: 4 }} direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                sx={{ mt: 4, width: "100%" }}
                                color="secondary"
                                onClick={handlePostSubmission}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    "Loading..."
                                ) : success ? (
                                    <>
                                        <CheckCircleIcon /> {success}
                                    </>
                                ) : (
                                    "Post"
                                )}
                            </Button>
                        </Stack>
                    }
                </Box>
            </Container>
        </>
    );
}
