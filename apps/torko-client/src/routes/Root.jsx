import React from 'react';
import MenuAppBar from '../components/MenuAppBar';
import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
import { Outlet, redirect } from "react-router-dom";

export async function loader() {
    const user = localStorage.getItem("user");
    if (!user) {
        return redirect("/");
    }
    return true;
}


const Root = () => {
    return (
        <>
            <MenuAppBar />
            <Container maxWidth="sm">
                <Outlet />
            </Container>
        </>
    );
};

export default Root;