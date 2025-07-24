import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { API_CONFIG, buildApiUrl } from "../config/api";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError("");

        try {
            const res = await axios.post(
                buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
                { username, password }
            );
            setToken(res.data.access, res.data.user);
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            
            if (error.response?.data) {
                // Handle field-specific errors
                if (typeof error.response.data === 'object') {
                    if (error.response.data.detail) {
                        setGeneralError(error.response.data.detail);
                    } else if (error.response.data.non_field_errors) {
                        setGeneralError(error.response.data.non_field_errors[0]);
                    } else {
                        setErrors(error.response.data);
                    }
                } else if (typeof error.response.data === 'string') {
                    setGeneralError(error.response.data);
                }
            } else if (error.message) {
                setGeneralError(error.message);
            } else {
                setGeneralError("Login failed. Please check your credentials and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        // Clear errors when user starts typing
        if (errors.username || generalError) {
            setErrors({ ...errors, username: "" });
            setGeneralError("");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        // Clear errors when user starts typing
        if (errors.password || generalError) {
            setErrors({ ...errors, password: "" });
            setGeneralError("");
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
                <Typography variant="h4" gutterBottom align="center">
                    Login
                </Typography>
                
                {generalError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {generalError}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
                        error={!!errors.username}
                        helperText={errors.username ? (Array.isArray(errors.username) ? errors.username[0] : errors.username) : ""}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                        error={!!errors.password}
                        helperText={errors.password ? (Array.isArray(errors.password) ? errors.password[0] : errors.password) : ""}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Container>
        </Box>
    );
};

export default Login;
