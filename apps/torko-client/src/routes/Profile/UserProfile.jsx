import React from "react";
import { useQuery } from "@tanstack/react-query";

import PostCard from "../../components/PostCard";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";

import CommentCard from "../../components/CommentCard";

export default function UserProfile() {
    const { user } = useAuthContext();
    const [data, setData] = React.useState(null);
    let { username } = useParams();
    const [isLoading, setIsLoading] = React.useState(true);

    const { isError, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_GET_USER_PROFILE}${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            if (res.ok) {
                const data = await res.json();
                setData(data);
                setIsLoading(false);
            }
            return res.json();
        },
    });


    const handleFollowUnfollow = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_API_POST_FOLLOW_UNFOLLOW}${data.user.username}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        if (res.ok) {
            const data = await res.json();
            setData(prevData => ({
                ...prevData,
                isFollowing: !data.isFollowing
            }));
        }
    };

    console.log(data)

    return (
        <>
            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    {data && (
                        <>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    mt: 2,
                                    width: "100%",
                                    p: 0,
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    sx={{ width: "140px", height: "140px" }}
                                    alt="Remy Sharp"
                                >
                                    <PersonIcon
                                        fontSize="large"
                                        color="secondary"
                                    />
                                </Avatar>
                                <Stack
                                    sx={{ textAlign: "left", width: "100%", overflow: "hidden"}}
                                    direction="column"
                                    spacing={2}
                                >
                                    <Typography variant="h3">
                                        {data.user.name}
                                    </Typography>
                                    <Typography
                                        variant="p"
                                        sx={{ margin: 0, padding: 0 }}
                                    >
                                        @{data.user.username}
                                    </Typography>
                                </Stack>
                                {
                                    user.username !== data.user.username ? (
                                    <Button
                                        onClick={handleFollowUnfollow}
                                        sx={{ padding: "4px 40px" }}
                                        size="large"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        {data.isFollowing ? "Unfollow" : "Follow"}
                                    </Button>) : ""
                                }
                            </Stack>
                            <Stack direction="column" spacing={2} sx={{mt: "20px"}}>
                                {
                                    data.posts.length > 0 ? (
                                    <>
                                        {data.posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                        ))}
                                    </>) : "No posts"
                                }
                            </Stack>
                                
                        </>
                    )}
                </>
            )}
        </>
    );
}
