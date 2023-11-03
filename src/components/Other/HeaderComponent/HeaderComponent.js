import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate desde React Router
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { Login } from '@mui/icons-material';

const PAGES = [
    { name: "Home", route: "/" },
    { name: "Schedules", route: "/schedule/view" },
    { name: "Trains", route: "/train/view" },
    { name: "Stations", route: "/station/view" },
    { name: "Searcher", route: "/schedule/search" },
];

const Header = () => {
    const [value, setValue] = useState(0);
    const isMatch = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate();

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        const selectedPage = PAGES[newValue];
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
                                {PAGES.map((page, index) => (
                                    <Tab key={index} label={page.name} />
                                ))}
                            </Tabs>
                            <Button sx={{ marginLeft: 'auto' }} variant='contained' onClick={handleLogin}>Login</Button>
                            <Button sx={{ marginLeft: '10px' }} variant='contained' onClick={handleRegister}>Sing Up</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;