import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const DrawerComponent = ({ pages, userRole, openDrawer, setOpenDrawer }) => {
    const navigate = useNavigate();

    const filteredPages = pages.filter((page) => {
        if (userRole === 'ROLE_ADMIN') {
            return true;
        } else if (userRole === 'ROLE_USER' && page.userOnly) {
            return true;
        }
        return false;
    });

    const handleNavigateToPage = (route) => {
        setOpenDrawer(false);
        navigate(route);
    };

    return (
        <React.Fragment>
            <Drawer 
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List>
                    {filteredPages.map((page) => (
                        <ListItemButton onClick={() => handleNavigateToPage(page.route)} key={page.route}>
                            <ListItemIcon>
                                <span className="material-icons">{page.icon}</span>
                            </ListItemIcon>
                            <ListItemText>{page.name}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <IconButton sx={{ color: 'white', marginLeft: 'auto' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon/>
            </IconButton>
        </React.Fragment>
    );
}

export default DrawerComponent;
