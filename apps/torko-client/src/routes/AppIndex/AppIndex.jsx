import React from "react";
import { useQuery } from "@tanstack/react-query";

import Container from "@mui/material/Container";

import { useNavigate, redirect } from "react-router-dom";

import Stack from "@mui/material/Stack";

import PostCard from "../../components/PostCard";
import CreateIcon from "@mui/icons-material/Create";
import Fab from "@mui/material/Fab";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function AppIndex() {
    const { user } = useAuthContext();
    const navigateTo = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [postStage, setPostStage] = React.useState("AmarDabi");
    const [posts, setPosts] = React.useState("");

    const fetchPosts = async () => {
        setIsLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_API_GET_POSTS}/${postStage}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        const data = await response.json();
        setPosts(data.posts);
        setIsLoading(false);
        return data;
    };

    React.useEffect(() => {
        fetchPosts();
    }, [postStage]);

    const selectStage = async (event) => {
        setPostStage(event.target.name);
        await fetchPosts();
    };

    return (
        <>
            {isLoading ? (
                <div style={{ margin: "20px" }}>Hold your horses...</div>
            ) : (
                <>
                    <Fab
                        onClick={(e) => navigateTo("post")}
                        sx={{
                            position: "fixed",
                            bottom: "16px",
                            right: "16px",
                        }}
                    >
                        <CreateIcon fontSize="medium" />
                    </Fab>

                    <div className="post-type-navigator">
                        <button
                            onClick={selectStage}
                            name="AmarDabi"
                            className={
                                postStage === "AmarDabi" ? "selected" : ""
                            }
                        >
                            AmarDabi
                        </button>
                        <button
                            onClick={selectStage}
                            name="AmaderDabi"
                            className={
                                postStage === "AmaderDabi" ? "selected" : ""
                            }
                        >
                            AmaderDabi
                        </button>
                        <button
                            onClick={selectStage}
                            name="ShobarDabi"
                            className={
                                postStage === "ShobarDabi" ? "selected" : ""
                            }
                        >
                            ShobarDabi
                        </button>
                    </div>

                    {posts && posts.length > 0 ? (
                        <Container sx={{ my: 2, px: 0 }} maxWidth="sm">
                            <Stack direction="column" spacing={2}>
                                {posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        navigateTo={navigateTo}
                                    />
                                ))}
                            </Stack>
                        </Container>
                    ) : (
                        <div style={{ margin: "20px" }}>
                            As empty as they come... :(
                        </div>
                    )}
                </>
            )}
        </>
    );
}
