import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Button,
    Divider,
    Box,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    LinearProgress,
    IconButton,
} from "@mui/material";
import {
    Park as TreeIcon,
    LocalFlorist as EcoIcon,
    Timeline as StatsIcon,
    ExitToApp as LogoutIcon,
    Nature as NatureIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_CONFIG, buildApiUrl } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard: React.FC = () => {
    const { token, setToken } = useAuth();
    const [stats, setStats] = useState<{
        total_trees: number;
        species_diversity: number;
        species_list: { species: string; count: number }[];
    }>({
        total_trees: 0,
        species_diversity: 0,
        species_list: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setLoading(true);
            setError(null);
            axios
                .get(buildApiUrl(API_CONFIG.ENDPOINTS.MY_STATS), {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    // Ensure species_list is always an array
                    const data = res.data;
                    if (data && typeof data === "object") {
                        setStats({
                            total_trees: data.total_trees || 0,
                            species_diversity: data.species_diversity || 0,
                            species_list: Array.isArray(data.species_list)
                                ? data.species_list
                                : [],
                        });
                    }
                })
                .catch((err) => {
                    console.error("Error fetching stats:", err);
                    alert("Session timeout, please login again.");
                    setError("Failed to load dashboard data");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        navigate("/login");
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        mx: "auto",
                        mb: 2,
                        boxShadow: 3,
                    }}
                >
                    <NatureIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                    My Impact Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Track your environmental contribution
                </Typography>
            </Box>

            {/* Conservation Appreciation Message */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    background:
                        "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                    border: "1px solid #4CAF50",
                    borderRadius: 3,
                    textAlign: "center",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                >
                    <EcoIcon
                        sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                    />
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                        Thank You for Making a Difference!
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ lineHeight: 1.6 }}
                >
                    Thank you for being part of the conservation effort to
                    restore our planet's forests and combat climate change.
                    Every tree you plant contributes to cleaner air, enhanced
                    biodiversity, and a healthier environment for future
                    generations. Your commitment to environmental conservation
                    helps create a sustainable world where nature and
                    communities thrive together.
                </Typography>
            </Paper>

            {/* Loading State */}
            {loading && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <LoadingSpinner
                        show={loading}
                        message="Loading your impact data..."
                    />
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        bgcolor: "error.light",
                        color: "error.contrastText",
                    }}
                >
                    <Typography variant="h6" align="center">
                        {error}
                    </Typography>
                </Paper>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <Box>
                    {/* Stats Cards */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    md: "1 1 calc(50% - 12px)",
                                },
                            }}
                        >
                            <Card
                                elevation={4}
                                sx={{
                                    height: "100%",
                                    background:
                                        "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                                    color: "white",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={2}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    "rgba(255,255,255,0.2)",
                                                mr: 2,
                                            }}
                                        >
                                            <TreeIcon />
                                        </Avatar>
                                        <Typography variant="h6" component="h2">
                                            Trees Planted
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="h2"
                                        component="div"
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                    >
                                        {stats.total_trees}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ opacity: 0.9 }}
                                    >
                                        Your contribution to reforestation
                                    </Typography>
                                    <TreeIcon
                                        sx={{
                                            position: "absolute",
                                            right: -20,
                                            bottom: -20,
                                            fontSize: 120,
                                            opacity: 0.1,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Box>

                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    md: "1 1 calc(50% - 12px)",
                                },
                            }}
                        >
                            <Card
                                elevation={4}
                                sx={{
                                    height: "100%",
                                    background:
                                        "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                                    color: "white",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={2}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    "rgba(255,255,255,0.2)",
                                                mr: 2,
                                            }}
                                        >
                                            <EcoIcon />
                                        </Avatar>
                                        <Typography variant="h6" component="h2">
                                            Species Diversity
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="h2"
                                        component="div"
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                    >
                                        {stats.species_diversity}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ opacity: 0.9 }}
                                    >
                                        Different species planted
                                    </Typography>
                                    <EcoIcon
                                        sx={{
                                            position: "absolute",
                                            right: -20,
                                            bottom: -20,
                                            fontSize: 120,
                                            opacity: 0.1,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    {/* Species List Card */}
                    <Card elevation={4} sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar
                                    sx={{ bgcolor: "secondary.main", mr: 2 }}
                                >
                                    <StatsIcon />
                                </Avatar>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Species Breakdown
                                </Typography>
                            </Box>

                            {!stats.species_list ||
                            stats.species_list.length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 6,
                                        bgcolor: "grey.50",
                                        borderRadius: 2,
                                    }}
                                >
                                    <NatureIcon
                                        sx={{
                                            fontSize: 60,
                                            color: "grey.400",
                                            mb: 2,
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No species recorded yet
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Start planting trees to see your impact!
                                    </Typography>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    {stats.species_list.map((item, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                flex: {
                                                    xs: "1 1 100%",
                                                    sm: "1 1 calc(50% - 8px)",
                                                    md: "1 1 calc(33.333% - 11px)",
                                                },
                                            }}
                                        >
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    background:
                                                        "linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)",
                                                    border: "1px solid #e0e0e0",
                                                }}
                                            >
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            {item.species}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Trees planted
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={item.count}
                                                        color="primary"
                                                        size="small"
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    />
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={
                                                        stats.total_trees > 0
                                                            ? (item.count /
                                                                  stats.total_trees) *
                                                              100
                                                            : 0
                                                    }
                                                    sx={{
                                                        mt: 1,
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            </Paper>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Logout Button */}
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: 3,
                                textTransform: "none",
                                boxShadow: 3,
                                "&:hover": {
                                    boxShadow: 6,
                                },
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Dashboard;
