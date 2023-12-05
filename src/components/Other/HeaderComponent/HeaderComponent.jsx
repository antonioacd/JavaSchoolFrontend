import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrainIcon from '@mui/icons-material/Train';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import userService from '../../../services/UserService';
import './HeaderComponent.css';

const PAGES = [
    { id: 0, name: "Home", route: "/", icon: <HomeIcon /> },
    { id: 1, name: "Searcher", route: "/schedule/search", icon: <TravelExploreIcon /> },
    { id: 2, name: "Schedules", route: "/schedule/view", icon: <CalendarMonthIcon /> },
    { id: 3, name: "Trains", route: "/train/view", icon: <TrainIcon /> },
    { id: 4, name: "Stations", route: "/station/view", icon: <LocationOnIcon /> },
    { id: 5, name: "Users", route: "/user/view", icon: <GroupIcon /> },
    { id: 6, name: "Tickets", route: "/ticket/view", icon: <ConfirmationNumberIcon /> },
];

const adminPages = [0, 1, 2, 3, 4, 5, 6];
const userPages = [0, 1];

const Header = () => {
    const [value, setValue] = useState(0);
    const isMatch = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false);

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
                    {isMatch ? (
                        <>
                            <Typography sx={{ fontSize: '1.5rem', paddingLeft: '10%' }}>RAILWAY</Typography>
                            <DrawerComponent
                                pages={PAGES}
                                userRole={userRole}
                                openDrawer={openDrawer}
                                setOpenDrawer={setOpenDrawer}
                            />
                        </>
                    ) : (
                        <>
                            <Tabs
                                sx={{ marginLeft: 'auto', '& .MuiTabs-flexContainer': { display: 'flex', alignItems: 'center' } }}
                                textColor='inherit'
                                value={value}
                                onChange={handleChangeTab}
                                indicatorColor='primary'
                            >
                                {token ? (
                                    PAGES.map((page) => {
                                        if (
                                            (userRole === 'ROLE_ADMIN' && adminPages.includes(page.id)) ||
                                            (userRole === 'ROLE_USER' && userPages.includes(page.id))
                                        ) {
                                            return (
                                                <Tab
                                                    key={page.route}
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span className="material-icons" style={{ marginRight: '4px' }}>{page.icon}</span>
                                                            <span>{page.name}</span>
                                                        </div>
                                                    }
                                                />
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    userPages.map((pageId) => {
                                        const page = PAGES.find((p) => p.id === pageId);
                                        return (
                                            <Tab
                                                key={page.route}
                                                label={
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span className="material-icons" style={{ marginRight: '4px' }}>{page.icon}</span>
                                                        <span>{page.name}</span>
                                                    </div>
                                                }
                                            />
                                        );
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
