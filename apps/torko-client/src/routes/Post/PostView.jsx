import React from "react";
import { useQuery } from "@tanstack/react-query";

import PostCard from "../../components/PostCard";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";

import CommentCard from "../../components/CommentCard"

export default function UserProfile() {
    const { user } = useAuthContext();
    const [data, setData] = React.useState(null)
    let { post_id } = useParams();
    const [comment, setComment] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true);

    const { isError, error } = useQuery({
        queryKey: ["post"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_GET_POST}${post_id}`,
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

    async function submitComment() {
        const res = await fetch(`${import.meta.env.VITE_API_POST_ADD_COMMENT}${post_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                username: user.username,
                comment_text_content: comment,
            }),
        });
        if (res.ok) {
            const commentData = await res.json();
            setData(prevData => ({
                ...prevData,
                comments: [ commentData, ...prevData.comments]
            }))
            setComment("")
        }
    }

    return (
        <>
            {isLoading ? (
                "Loading..."
            ) : (
                <div style={{"marginTop": "1.5rem"}}>
                    {data && (
                        <>
                            <PostCard post={data.post} />
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
                                <Avatar alt="Remy Sharp">
                                    <PersonIcon
                                        fontSize="large"
                                        color="secondary"
                                    />
                                </Avatar>
                            
                                <input
                                    type="text"
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
                                        minHeight: "60px",
                                    }}
                                    placeholder="Comment here"
                                    value={comment}
                                    onChange={e => {
                                        setComment(e.target.value)
                                    }}
                                />
                                {/* </Stack> */}
                                <IconButton onClick={submitComment}>
                                    <SendIcon color="secondary" />
                                </IconButton>
                            </Stack>
                            <Stack direction="column" spacing={2} sx={{mt: "20px", mb: "30px"}}>
    
                                {data.comments.map((comment) => (
                                    <CommentCard key={comment.comment_text_content} comment={comment} setData={setData} />
                                ))}
                            </Stack>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
