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
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMutation } from "@tanstack/react-query";

export default function CommentCard({ comment }) {
    return (
        <>
            {comment && (
                <>
                    <Card
                        raised={true}
                        sx={{
                            backgroundColor: "#1e1e1e",
                            width: "100%",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            paddingTop: '10px',
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2}>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                                <Stack direction="column">
                                    <Typography
                                        color="secondary"
                                        variant="h6"
                                        sx={{ textAlign: "left", fontSize: "12px" }}
                                    >
                                        @{comment.username}
                                    </Typography>
                                    <Typography
                                        color="secondary"
                                        variant="body2"
                                        sx={{textAlign: "left", mt: 1}}
                                    >
                                        {comment.comment_text_content}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    );
}
