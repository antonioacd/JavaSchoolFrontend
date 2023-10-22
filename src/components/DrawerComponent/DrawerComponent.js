import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PAGES = [
    { name: "Schedules", route: "/create-schedule" },
    { name: "Trains", route: "/create-train" },
    { name: "Stations", route: "/create-station" },
    { name: "Login", route: "/login" },
    { name: "Logout", route: "/logout" }
];

const DrawerComponent = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

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
              {PAGES.map((page, index) => (
                  <ListItemButton onClick={() => handleNavigateToPage(page.route)} key={index}>
                      <ListItemIcon>
                          <ListItemText>{page.name}</ListItemText>
                      </ListItemIcon>
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
