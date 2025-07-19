import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar: React.FC = () => {
    const { token, setToken, user } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        setToken(null);
        navigate("/login");
        setDrawerOpen(false);
    };

    // Helper function to capitalize first letter
    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Helper function to get time-based greeting
    const getTimeBasedGreeting = (): string => {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            return "Good morning";
        } else if (currentHour < 17) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    };

    // Get formatted username
    const getFormattedUsername = (): string => {
        if (!user) return "";
        const username = typeof user === "string" ? user : user.username;
        return capitalizeFirstLetter(username);
    };

    const menuLinks = [
        { label: "Map", to: "/" },
        ...(token ? [{ label: "Dashboard", to: "/dashboard" }] : []),
        ...(token
            ? [{ label: "Logout", action: handleLogout }]
            : [
                  { label: "Login", to: "/login" },
                  { label: "Register", to: "/register" },
              ]),
    ];

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: "darkForest.main" }}>
                <Toolbar>
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                        }}
                    >
                        <img
                            src="/GreenLife-logo.png"
                            alt="GreenLife Logo"
                            style={{
                                height: "80px",
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                    {/* Desktop menu */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                        }}
                    >
                        {token && user && (
                            <Typography
                                variant="h6"
                                sx={{
                                    mr: 2,
                                    fontWeight: "bold",
                                    color: "inherit",
                                }}
                            >
                                {getTimeBasedGreeting()},{" "}
                                {getFormattedUsername()}!
                            </Typography>
                        )}
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            Map
                        </Button>
                        {token ? (
                            <>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/dashboard"
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    Dashboard
                                </Button>
                                <Button 
                                    color="inherit" 
                                    onClick={handleLogout}
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/login"
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/register"
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                    {/* Mobile menu icon on the right */}
                    <IconButton
                        color="inherit"
                        edge="end"
                        sx={{ display: { xs: "block", md: "none" } }}
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
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box
                    sx={{ width: 220 }}
                    role="presentation"
                    onClick={() => setDrawerOpen(false)}
                >
                    <Box sx={{ p: 2, display: "flex", justifyContent: "start" }}>
                        <img
                            src="/GreenLife-logo-mobile.png"
                            alt="GreenLife Logo"
                            style={{
                                height: "48px",
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                    <Divider />
                    {token && user && (
                        <Typography sx={{ p: 2 }}>
                            <strong>
                            {getTimeBasedGreeting()}, {getFormattedUsername()}!</strong>
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
                                <ListItem onClick={item.action} key={idx}>
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
