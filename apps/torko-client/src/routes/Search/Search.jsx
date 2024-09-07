import * as React from "react";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import Stack from "@mui/material/Stack";
import PostCard from "../../components/PostCard";

import { useNavigate } from "react-router-dom"

export default function Search() {
    const [search, setSearch] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState([]);
    const navigateTo = useNavigate()

    async function handleSearchChange(event) {
        setSearch(event.target.value);

        if (event.target.value) {
            setIsLoading(true);
            // fetch data
            const res = await fetch(
                `${import.meta.env.VITE_API_PRANGON_SEARCH}?query=${search}`
            );

            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
                setIsLoading(false);
            }
        }
    }
    console.log(searchResults);

    return (
        <>
            <input
                style={{ margin: "15px 0px" }}
                id="search"
                type="text"
                placeholder="Search for other users"
                value={search}
                onChange={handleSearchChange}
            />
            {search && (
                <Stack
                    sx={{ textAlign: "left" }}
                    direction="column"
                    spacing={2}
                >
                    <Stack>
                        <Typography variant="h4">Search Results</Typography>
                    </Stack>
                    {searchResults.UserResults && (
                        <>
                            <Stack>
                                <Typography variant="h6">People</Typography>
                                {searchResults.UserResults.length > 0 ? (
                                    <Stack>
                                        {searchResults.UserResults.map(
                                            (user) => (
                                                <Stack
                                                    direction="row"
                                                    key={user._id}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        m: 1,
                                                        p: 2,
                                                        border: "1px solid #ebffea",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#ebffea",
                                                            cursor: "pointer",
                                                            color: "#000",
                                                        },
                                                    }}
                                                    onClick={() =>
                                                        navigateTo(
                                                            `/app/profile/${user.username}`
                                                        )
                                                    }
                                                >
                                                    {user.profile_picture ? (
                                                        <img
                                                            src={
                                                                user.profile_picture
                                                            }
                                                            alt={user.username}
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                                borderRadius:
                                                                    "50%",
                                                                marginRight:
                                                                    "10px",
                                                            }}
                                                        />
                                                    ) : (
                                                        <PersonIcon
                                                            sx={{
                                                                width: "50px",
                                                                height: "50px",
                                                                borderRadius:
                                                                    "50%",
                                                                marginRight:
                                                                    "10px",
                                                            }}
                                                        />
                                                    )}
                                                    <Stack direction="column">
                                                        <Typography>
                                                            {user.name}
                                                        </Typography>
                                                        <Typography>
                                                            @{user.username}
                                                        </Typography>
                                                        <Typography>
                                                            {user.email}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            )
                                        )}
                                    </Stack>
                                ) : (
                                    "No  matching users found"
                                )}
                            </Stack>
                            <Stack>
                                <Typography variant="h6">Posts</Typography>
                                {searchResults.postResults.length > 0
                                    ? searchResults.postResults.map((post) => (
                                        <div style={{margin: "10px 0px"}}>
                                            <PostCard post={post} />
                                        </div>
                                      ))
                                    : "No  matching users found"}
                            </Stack>
                        </>
                    )}
                </Stack>
            )}
        </>
    );
}
