import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, List, ListItem, ListItemText, Paper, Button, Divider, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { token, setToken } = useAuth();
    const [stats, setStats] = useState<{ total_trees: number; species_diversity: number; species_list: { species: string; count: number }[] }>({
        total_trees: 0,
        species_diversity: 0,
        species_list: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios.get('http://134.149.216.180:8000/api/trees/my_stats/', {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => setStats(res.data));
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    My Impact Dashboard
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="subtitle1">Total Trees Planted:</Typography>
                    <Typography variant="h6" color="primary">{stats.total_trees}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="subtitle1">Species Diversity:</Typography>
                    <Typography variant="h6" color="secondary">{stats.species_diversity}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Species List:</Typography>
                <List dense>
                    {stats.species_list.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No species recorded yet." />
                        </ListItem>
                    ) : (
                        stats.species_list.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListItemText primary={`${item.species}: ${item.count}`} />
                            </ListItem>
                        ))
                    )}
                </List>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{ mt: 3, width: '100%' }}
                >
                    Logout
                </Button>
            </Paper>
        </Container>
    );
};

export default Dashboard;
