import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icono de cuenta
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useEffect } from 'react';
import userService from '../../../services/UserService';

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

    const token = localStorage.getItem('accessToken'); // Obtiene el token del almacenamiento local
    const userRole = "USER"; // Puedes obtener el rol del usuario de tu sistema de autenticación

    useEffect(() => {
        const email = localStorage.getItem('email');

        if(email){
            userService.getUserByEmail(email)
            .then((response) => {
                console.log("Entra",response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, []);


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
                                {PAGES.map((page, index) => {
                                    if (userRole === 'USER') {
                                        if (page.name === 'Searcher') {
                                            return <Tab key={index} label={page.name} />;
                                        }
                                    } else {
                                        return <Tab key={index} label={page.name} />;
                                    }
                                })}
                            </Tabs>
                            {token ? (
                                <AccountCircleIcon sx={{ fontSize: 32, color: 'white', marginLeft: 'auto' }} />
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
