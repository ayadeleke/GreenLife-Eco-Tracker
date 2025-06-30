import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const Register: React.FC = () => {
    const [form, setForm] = useState({ username: '', password: '', confirm_password: '', email: '', first_name: '', last_name: '' });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await axios.post('http://127.0.0.1:8000/api/register/', form);
        navigate('/login');
        } catch {
        alert('Registration failed');
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f5f5f5"
        >
            <Container maxWidth="xs">
                <Typography variant="h4" gutterBottom align="center">Register</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Username" name="username" fullWidth margin="normal" value={form.username} onChange={handleChange} />
                    <TextField label="Email" name="email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
                    <TextField label="First Name" name="first_name" fullWidth margin="normal" value={form.first_name} onChange={handleChange} />
                    <TextField label="Last Name" name="last_name" fullWidth margin="normal" value={form.last_name} onChange={handleChange} />
                    <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} />
                    <TextField label="Confirm Password" name="confirm_password" type="password" fullWidth margin="normal" value={form.confirm_password} onChange={handleChange} />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
                </form>
            </Container>
        </Box>
    );
};

export default Register;