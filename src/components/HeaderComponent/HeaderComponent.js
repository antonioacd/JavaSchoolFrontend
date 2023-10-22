import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate desde React Router
import DrawerComponent from '../DrawerComponent/DrawerComponent';

const PAGES = [
    { name: "Schedules", route: "/create-schedule" },
    { name: "Trains", route: "/create-train" },
    { name: "Stations", route: "/create-station" }
];

const Header = () => {
    const [value, setValue] = useState(0); // Establece el valor inicial en 0 para la primera pestaña
    const isMatch = useMediaQuery('(max-width:960px)');
    const navigate = useNavigate(); // Obtiene la función de navegación

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        const selectedPage = PAGES[newValue];
        navigate(selectedPage.route);
    };

    return (
        <React.Fragment>
            <AppBar sx={{ background: "#063970" }}>
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
                                indicatorColor='secondary'
                            >
                                {PAGES.map((page, index) => (
                                    <Tab key={index} label={page.name} />
                                ))}
                            </Tabs>
                            <Button sx={{ marginLeft: 'auto' }} variant='contained'>Login</Button>
                            <Button sx={{ marginLeft: '10px' }} variant='contained'>Sing Up</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;
