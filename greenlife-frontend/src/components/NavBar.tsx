import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
    const { token, setToken, user } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
        setDrawerOpen(false);
    };

    const menuLinks = [
        { label: 'Map', to: '/' },
        ...(token ? [{ label: 'Dashboard', to: '/dashboard' }] : []),
        ...(token
            ? [{ label: 'Logout', action: handleLogout }]
            : [
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' }
            ]),
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                        GreenLife
                    </Typography>
                    {/* Desktop menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {token && user && (
                            <Typography sx={{ mr: 2 }}>
                                Welcome, {typeof user === 'string' ? user : user.username}
                            </Typography>
                        )}
                        <Button color="inherit" component={Link} to="/">Map</Button>
                        {token ? (
                            <>
                                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">Login</Button>
                                <Button color="inherit" component={Link} to="/register">Register</Button>
                            </>
                        )}
                    </Box>
                    {/* Mobile menu icon on the right */}
                    <IconButton
                        color="inherit"
                        edge="end"
                        sx={{ display: { xs: 'block', md: 'none' } }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        GreenLife
                    </Typography>
                    <Divider />
                    {token && user && (
                        <Typography sx={{ p: 2 }}>
                            Welcome, {typeof user === 'string' ? user : user.username}
                        </Typography>
                    )}
                    <List>
                        {menuLinks.map((item, idx) =>
                            item.to ? (
                                <ListItem
                                    component={Link}
                                    to={item.to}
                                    key={idx}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            ) : (
                                <ListItem
                                    onClick={item.action}
                                    key={idx}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            )
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default NavBar;