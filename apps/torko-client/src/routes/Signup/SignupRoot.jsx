import React from 'react';
import SignupAppBar from '../../components/SignupAppBar';
import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
import { Outlet, redirect } from "react-router-dom";




export default function SignupRoot() {
    const [userData, setUserData] = React.useState({
        "username": "",
        "password": "",
        "name": "",
        "personal_email": "",
        "email": "",
        "profile_picture": "",
        "department": "",
        "program": "",
        "student_id": "",
        "enrollment_year": "",
    })
    return (
        <>
            <SignupAppBar />
            <Container maxWidth="sm">
                <Outlet context={{ userData, setUserData }} />
            </Container>
        </>
    );
};