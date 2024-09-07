import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useLogout } from "../hooks/useLogout";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

export default function MenuAppBar() {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const redirectToSearch = () => {
        if (location.pathname == "/app/search") {
            navigate(-1);
            return;
        }
        navigate("search");
    };

    const handleRedirectToProfile = () => {
        navigate(`/app/profile/${user.username}`);
    };

    const handleLogout = () => {
        logout();
    };

    console.log(user.username)

    return (
        <Box sx={{ width: "100%", flexGrow: 1 }}>
            <AppBar
                sx={{ boxShadow: "none" }}
                color="primary"
                position="static"
            >
                <Toolbar sx={{ width: "100%", maxWidth: "1280px", mx: "auto" }}>
                    {location.pathname !== "/app" &&
                        location.pathname !== "/app/search" && (
                            <IconButton
                                size="large"
                                aria-label="home"
                                color="inherit"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        )}

                    <IconButton
                        size="large"
                        aria-label="search"
                        color="inherit"
                        onClick={redirectToSearch}
                    >
                        {location.pathname == "/app/search" ? (
                            <ArrowBackIcon />
                        ) : (
                            <SearchIcon />
                        )}
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <Link to="/app">
                            <span className="prangon-logo">Bitorko</span>
                        </Link>
                    </Typography>

                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-profile"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleRedirectToProfile}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
