import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            setToken(res.data.access, res.data.user); // Make sure res.data.user is { username: "..." }
            navigate('/dashboard');
        } catch {
            alert('Invalid credentials');
        }
    };

    // Example login function
    const handleLogin = async () => {
        const response = await axios.post('/api/auth/login/', { username, password });
        setToken(response.data.token, { username: response.data.user.username });
        // or setToken(response.data.token, response.data.user);
    };

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
        <Container maxWidth="xs">
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
            <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
        </form>
        </Container>
        </Box>
    );
};

export default Login;