import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import userService from '../../../services/UserService';
import './HeaderComponent.css';

const PAGES = [
    { id: 0, name: "Home", route: "/" },
    { id: 1, name: "Searcher", route: "/schedule/search" },
    { id: 2, name: "Schedules", route: "/schedule/view" },
    { id: 3, name: "Trains", route: "/train/view" },
    { id: 4, name: "Stations", route: "/station/view" },
    { id: 5, name: "Users", route: "/user/view" },
    { id: 6, name: "Tickets", route: "/ticket/view" },
];

const adminPages = [0, 1, 2, 3, 4, 5, 6];
const userPages = [0, 1];

const Header = () => {
    const [value, setValue] = useState(0);
    const isMatch = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('email');

        if (email) {
            userService.getUserByEmail(email)
                .then((response) => {
                    setUserRole(response.data.roles[0].name);
                })
                .catch((error) => {
                    console.error("Error fetching user role:", error);
                });
        }
    }, [token]);

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        const selectedPage = PAGES.find((page) => page.id === newValue);
        navigate(selectedPage.route);
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <React.Fragment>
            <AppBar className='bg-primary'>
                <Toolbar>
                    <TrainIcon />
                    {isMatch ? (
                        <>
                            <Typography sx={{ fontSize: '1.5rem', paddingLeft: '10%' }}>RAILWAY</Typography>
                            <DrawerComponent />
                        </>
                    ) : (
                        <>
                            <Tabs
                                sx={{ marginLeft: 'auto' }}
                                textColor='inherit'
                                value={value}
                                onChange={handleChangeTab}
                                indicatorColor='primary'
                            >
                                {token ? (
                                    PAGES.map((page) => {
                                        if (
                                            (userRole === 'ADMIN' && adminPages.includes(page.id)) ||
                                            (userRole === 'USER' && userPages.includes(page.id))
                                        ) {
                                            return <Tab key={page.route} label={page.name} />;
                                        }
                                        return null;
                                    })
                                ) : (
                                    userPages.map((pageId) => {
                                        const page = PAGES.find((p) => p.id === pageId);
                                        return <Tab key={page.route} label={page.name} />;
                                    })
                                )}
                            </Tabs>
                            {token ? (
                                <AccountCircleIcon
                                className="profile-icon"
                                onClick={handleProfileClick}
                                />
                            ) : (
                                <>
                                    <Button sx={{ marginLeft: 'auto' }} variant='contained' onClick={handleLogin}>Login</Button>
                                    <Button sx={{ marginLeft: '10px' }} variant='contained' onClick={handleRegister}>Sign Up</Button>
                                </>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;
