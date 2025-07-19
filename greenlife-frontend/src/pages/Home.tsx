import React, { useState } from "react";
import TreeMap from "../components/TreeMap";
import TreeForm from "../components/TreeForm";
import TreeStatistics from "../components/TreeStatistics";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Fade,
    Slide,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    LocationOn as LocationIcon,
    Nature as NatureIcon,
    AddLocationAlt as AddTreeIcon,
    LocalFlorist as EcoIcon,
} from "@mui/icons-material";

const Home: React.FC = () => {
    const { token } = useAuth();
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLng, setSelectedLng] = useState<number | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [selectedSpecies, setSelectedSpecies] = useState<string>("All");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background:
                        "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                    color: "white",
                    py: { xs: 4, md: 6 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    <Fade in timeout={1000}>
                        <Box textAlign="center" position="relative" zIndex={2}>
                            <Avatar
                                sx={{
                                    width: { xs: 60, md: 80 },
                                    height: { xs: 60, md: 80 },
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    mx: "auto",
                                    mb: 2,
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <NatureIcon
                                    sx={{ fontSize: { xs: 30, md: 40 } }}
                                />
                            </Avatar>
                            <Typography
                                variant={isMobile ? "h3" : "h2"}
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                }}
                            >
                                GreenLife Eco Tracker
                            </Typography>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                sx={{
                                    opacity: 0.9,
                                    maxWidth: 600,
                                    mx: "auto",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                }}
                            >
                                Plant trees, track your impact, and help create
                                a greener future for our planet
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Decorative Elements */}
                    <NatureIcon
                        sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            fontSize: 100,
                            opacity: 0.1,
                            transform: "rotate(15deg)",
                        }}
                    />
                    <EcoIcon
                        sx={{
                            position: "absolute",
                            bottom: 20,
                            left: 20,
                            fontSize: 80,
                            opacity: 0.1,
                            transform: "rotate(-15deg)",
                        }}
                    />
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Instructions Section */}
                <Slide direction="up" in timeout={1200}>
                    <Box mb={6}>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "primary.main",
                                mb: 3,
                            }}
                        >
                            How It Works
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            <Box
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        md: "1 1 calc(33.333% - 16px)",
                                    },
                                }}
                            >
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: "100%",
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Avatar
                                            sx={{
                                                bgcolor: "primary.main",
                                                mx: "auto",
                                                mb: 2,
                                            }}
                                        >
                                            <LocationIcon />
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            1. Select Location
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Click on the map to choose where you
                                            planted your tree
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        md: "1 1 calc(33.333% - 16px)",
                                    },
                                }}
                            >
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: "100%",
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Avatar
                                            sx={{
                                                bgcolor: "secondary.main",
                                                mx: "auto",
                                                mb: 2,
                                            }}
                                        >
                                            <AddTreeIcon />
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            2. Add Tree Details
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Fill in the species, date, and other
                                            information about your tree
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box
                                sx={{
                                    flex: {
                                        xs: "1 1 100%",
                                        md: "1 1 calc(33.333% - 16px)",
                                    },
                                }}
                            >
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: "100%",
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Avatar
                                            sx={{
                                                bgcolor: "info.main",
                                                mx: "auto",
                                                mb: 2,
                                            }}
                                        >
                                            <EcoIcon />
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            3. Track Impact
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Monitor your environmental
                                            contribution and see your progress
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </Box>
                </Slide>

                {/* Map and Form Section */}
                <Slide direction="up" in timeout={1400}>
                    <Box>
                        {/* Map Section - Full Width */}
                        <Box sx={{ mb: 3 }} data-map-section>
                            <Paper
                                elevation={4}
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    height: { xs: 400, md: 600 },
                                    p: 0,
                                    m: 0,
                                    "& .leaflet-container": {
                                        margin: 0,
                                        padding: 0,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        height: "100%",
                                        width: "100%",
                                        m: 0,
                                        p: 0,
                                    }}
                                >
                                    {selectedLat && selectedLng && (
                                        <Chip
                                            icon={<LocationIcon />}
                                            label={
                                                selectedAddress ||
                                                `${selectedLat.toFixed(
                                                    4
                                                )}, ${selectedLng.toFixed(4)}`
                                            }
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                left: 16,
                                                zIndex: 1000,
                                                bgcolor: "primary.main",
                                                color: "white",
                                                fontWeight: "bold",
                                            }}
                                        />
                                    )}
                                    <TreeMap
                                        onLocationSelect={(
                                            lat,
                                            lng,
                                            address
                                        ) => {
                                            setSelectedLat(lat);
                                            setSelectedLng(lng);
                                            setSelectedAddress(address || "");
                                        }}
                                        selectedSpecies={selectedSpecies}
                                        onSpeciesChange={setSelectedSpecies}
                                    />
                                </Box>
                            </Paper>
                        </Box>

                        {/* Tree Statistics Section */}
                        <TreeStatistics
                            onSpeciesSelect={(species) => {
                                setSelectedSpecies(species);
                                // Scroll to map section when species is selected
                                const mapSection =
                                    document.querySelector(
                                        "[data-map-section]"
                                    );
                                if (mapSection) {
                                    mapSection.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }
                            }}
                        />

                        {/* Form Section - Below Map */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Box
                                sx={{
                                    width: { xs: "100%", md: "60%", lg: "50%" },
                                }}
                            >
                                {token ? (
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            borderRadius: 3,
                                            p: 3,
                                            background:
                                                "linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)",
                                        }}
                                    >
                                        <Box textAlign="center" mb={3}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "success.main",
                                                    mx: "auto",
                                                    mb: 2,
                                                }}
                                            >
                                                <AddTreeIcon />
                                            </Avatar>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                                gutterBottom
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                Add Your Tree
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Record your tree planting
                                                contribution
                                            </Typography>
                                        </Box>
                                        <TreeForm
                                            token={token}
                                            onSuccess={() =>
                                                window.location.reload()
                                            }
                                            latitude={selectedLat}
                                            longitude={selectedLng}
                                            address={selectedAddress}
                                        />
                                    </Paper>
                                ) : (
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            borderRadius: 3,
                                            p: 4,
                                            textAlign: "center",
                                            bgcolor: "info.light",
                                            color: "info.contrastText",
                                        }}
                                    >
                                        <EcoIcon sx={{ fontSize: 60, mb: 2 }} />
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            gutterBottom
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            Join the Movement
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            <Link
                                                to="/login"
                                                style={{
                                                    color: "inherit",
                                                    textDecoration: "underline",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Sign in
                                            </Link>{" "}
                                            to start tracking your tree planting
                                            journey and make a positive impact
                                            on our environment.
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontStyle: "italic" }}
                                        >
                                            Every tree counts! 🌱
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Slide>

                {/* Call to Action */}
                {!token && (
                    <Fade in timeout={1600}>
                        <Box
                            sx={{
                                mt: 4,
                                p: 4,
                                textAlign: "center",
                                borderRadius: 3,
                                background:
                                    "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    color: "primary.main",
                                }}
                            >
                                Ready to Make a Difference?
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                paragraph
                            >
                                Join thousands of environmental champions who
                                are already making our planet greener.
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Chip label="🌱 Plant Trees" color="primary" />
                                <Chip
                                    label="📍 Track Locations"
                                    color="secondary"
                                />
                                <Chip
                                    label="📊 Monitor Impact"
                                    color="success"
                                />
                                <Chip label="🌍 Save Planet" color="info" />
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export interface TreeFormProps {
    token: string;
    onSuccess: () => void;
    latitude: number | null;
    longitude: number | null;
    address: string;
}

export default Home;
