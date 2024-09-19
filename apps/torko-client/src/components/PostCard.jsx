import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import { useNavigate, useParams, redirect } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMutation } from "@tanstack/react-query";

const handleUpvoteRequest = async ({ post_id, token }) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_POST_ADD_REMOVE_UPVOTE}${post_id}`,
        {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const responseData = await response.json();
    if (response.ok) return responseData;

    console.log("response is", responseData);
    throw new Error(responseData.error);
};

const handleDownvoteRequest = async ({ post_id, token }) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_POST_ADD_REMOVE_DOWNVOTE}${post_id}`,
        {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const responseData = await response.json();
    if (response.ok) {
        return responseData;
    }

    throw new Error(responseData.error);
};

export default function PostCard({ post }) {
    const { user } = useAuthContext();
    // const { post_id } = useParams();
    const [upvote, setUpvote] = React.useState(
        post.upvotes.find((u) => u === user.username)
    );
    const [downvote, setDownvote] = React.useState(
        post.downvotes.find((u) => u === user.username)
    );
    
    const navigateTo = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: handleUpvoteRequest,
        onMutate: () => {
            if (upvote) {
                setUpvote(false);
            } else {
                setUpvote(true);
                setDownvote(false);
            }
        },
        onError: (error) => {
            console.error(error);
        },
    });

    function handleUpvote() {
        mutate({ post_id: post._id, token: user.token });
    }

    async function handleDownvote() {
        const responseData = await handleDownvoteRequest({
            post_id: post._id,
            token: user.token,
        });

        if (responseData) {
            if (downvote) {
                setDownvote(false);
            } else {
                setDownvote(true);
                setUpvote(false);
            }
        }
    }

    return (
        <>
            {post && (
                <>
                    <Card
                        raised={true}
                        sx={{
                            backgroundColor: "#1e1e1e",
                            width: "100%",
                            borderRadius: "5px",
                        }}
                        className="post-card"
                    >
                        {/* <CardActionArea> */}
                        <CardActions
                            onClick={() => navigateTo(`/app/post/${post._id}`)}
                        >
                            {post.post_image_content && (
                                <CardMedia
                                    component="img"
                                    image={`${import.meta.env.VITE_API_ROOT}${
                                        post.post_image_content
                                    }`}
                                    onClick={(e) =>
                                        (href.location = `${
                                            import.meta.env.VITE_API_ROOT
                                        }${post.post_image_content}`)
                                    }
                                    alt="green iguana"
                                />
                            )}
                        </CardActions>
                        <CardContent sx={{ color: "secondary.main" }}>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingBottom: 1,
                                }}
                            >
                                <Avatar alt="Remy Sharp">
                                    <PersonIcon
                                        fontSize="large"
                                        color="secondary"
                                    />
                                </Avatar>
                                <Stack
                                    direction="column"
                                    spacing={0}
                                    // sx={{ display: "flex", alignItems: "center" }}
                                >
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            p: 0,
                                            m: 0,
                                            fontSize: "16px",
                                            textAlign: "left",
                                            "&:hover": {
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            },
                                        }}
                                        onClick={(e) =>
                                            navigateTo(
                                                `/app/profile/${post.username}`
                                            )
                                        }
                                    >
                                        {post.author_name}
                                    </Typography>

                                    <Typography
                                        variant="p"
                                        component="div"
                                        sx={{
                                            textAlign: "left",
                                            fontSize: "12px",
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={(e) =>
                                            navigateTo(
                                                `/app/profile/${post.username}`
                                            )
                                        }
                                    >
                                        @{post.username}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Typography
                                sx={{ textAlign: "left" }}
                                variant="body2"
                                onClick={(e) =>
                                    navigateTo(`/app/post/${post._id}`)
                                }
                            >
                                {post.post_text_content}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Stack
                                sx={{
                                    color: "secondary.main",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-around",
                                }}
                                direction="row"
                                spacing={2}
                            >
                                <IconButton onClick={handleUpvote}>
                                    {upvote ? (
                                        <ThumbUpIcon color="secondary" />
                                    ) : (
                                        <ThumbUpOffAltIcon color="secondary" />
                                    )}
                                </IconButton>
                                <IconButton onClick={handleDownvote}>
                                    {downvote ? (
                                        <ThumbDownIcon color="secondary" />
                                    ) : (
                                        <ThumbDownOffAltIcon color="secondary" />
                                    )}
                                </IconButton>

                                <IconButton
                                    disabled={false}
                                    onClick={(e) => {
                                        navigateTo(`/app/post/${post._id}`);
                                    }}
                                >
                                    <CommentIcon color="secondary" />
                                </IconButton>
                            </Stack>
                        </CardActions>
                        {/* </CardActionArea> */}
                    </Card>
                </>
            )}
        </>
    );
}
