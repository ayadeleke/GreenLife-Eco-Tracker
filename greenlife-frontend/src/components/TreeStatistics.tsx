import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    Chip,
    Fade,
    useTheme,
    useMediaQuery,
    Button,
    Collapse,
} from "@mui/material";
import {
    Nature as NatureIcon,
    TrendingUp as TrendingUpIcon,
    LocalFlorist as EcoIcon,
    Park as ParkIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

interface TreeData {
    species: string;
    count: number;
    percentage: number;
}

interface TreeStatisticsProps {
    onSpeciesSelect?: (species: string) => void;
}

const TreeStatistics: React.FC<TreeStatisticsProps> = ({ onSpeciesSelect }) => {
    const [treeData, setTreeData] = useState<TreeData[]>([]);
    const [allTreeData, setAllTreeData] = useState<TreeData[]>([]);
    const [totalTrees, setTotalTrees] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAll, setShowAll] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        const fetchTreeStatistics = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    buildApiUrl(API_CONFIG.ENDPOINTS.TREES)
                );
                const trees = response.data.results || response.data;

                // Group trees by species
                const speciesCount: { [key: string]: number } = {};
                trees.forEach((tree: any) => {
                    if (tree.species) {
                        speciesCount[tree.species] =
                            (speciesCount[tree.species] || 0) + 1;
                    }
                });

                const total = trees.length;
                setTotalTrees(total);

                // Convert to array and calculate percentages
                const allData: TreeData[] = Object.entries(speciesCount)
                    .map(([species, count]) => ({
                        species,
                        count,
                        percentage: total > 0 ? (count / total) * 100 : 0,
                    }))
                    .sort((a, b) => b.count - a.count);

                setAllTreeData(allData);
                setTreeData(allData.slice(0, 8)); // Show top 8 species initially
            } catch (error) {
                console.error("Error fetching tree statistics:", error);
                setTreeData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTreeStatistics();
    }, []);

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
    };

    const displayData = showAll ? allTreeData : treeData;
    const hasMoreSpecies = allTreeData.length > 8;

    const getSpeciesColor = (count: number): string => {
        if (count >= 6) {
            // High count - Green variations
            const greenColors = [
                "#4CAF50",
                "#66BB6A",
                "#81C784",
                "#388E3C",
                "#43A047",
            ];
            return greenColors[Math.floor(Math.random() * greenColors.length)];
        } else if (count >= 2 && count <= 5) {
            // Medium count - Orange variations
            const orangeColors = [
                "#FF9800",
                "#FFB74D",
                "#FFA726",
                "#FB8C00",
                "#F57C00",
            ];
            return orangeColors[
                Math.floor(Math.random() * orangeColors.length)
            ];
        } else {
            // Low count (1-2) - Red variations
            const redColors = [
                "#F44336",
                "#E57373",
                "#EF5350",
                "#D32F2F",
                "#C62828",
            ];
            return redColors[Math.floor(Math.random() * redColors.length)];
        }
    };

    const getSpeciesIcon = (species: string): React.ReactNode => {
        const lowerSpecies = species.toLowerCase();
        if (lowerSpecies.includes("oak")) return "🌳";
        if (lowerSpecies.includes("pine")) return "🌲";
        if (lowerSpecies.includes("maple")) return "🍁";
        if (lowerSpecies.includes("birch")) return "🌿";
        if (lowerSpecies.includes("cedar")) return "🌲";
        return "🌳";
    };

    return (
        <Box sx={{ py: 6, bgcolor: "grey.50" }}>
            <Container maxWidth="lg">
                <Fade in timeout={1000}>
                    <Box mb={4} textAlign="center">
                        <Avatar
                            sx={{
                                width: { xs: 60, md: 80 },
                                height: { xs: 60, md: 80 },
                                bgcolor: "success.main",
                                mx: "auto",
                                mb: 2,
                            }}
                        >
                            <TrendingUpIcon
                                sx={{ fontSize: { xs: 30, md: 40 } }}
                            />
                        </Avatar>
                        <Typography
                            variant={isMobile ? "h4" : "h3"}
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                            Tree Species Analytics
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mx: "auto" }}
                        >
                            Explore the diversity of trees planted in our
                            ecosystem restoration efforts
                        </Typography>
                    </Box>
                </Fade>

                {/* Summary Cards */}
                <Fade in timeout={1200}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 3,
                            mb: 8,
                        }}
                    >
                        <Card
                            elevation={3}
                            sx={{ textAlign: "center", p: 2, height: "100%" }}
                        >
                            <CardContent>
                                <Avatar
                                    sx={{
                                        bgcolor: "primary.main",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <NatureIcon />
                                </Avatar>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "primary.main",
                                    }}
                                >
                                    {loading
                                        ? "..."
                                        : totalTrees.toLocaleString()}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Trees Planted
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            elevation={3}
                            sx={{ textAlign: "center", p: 2, height: "100%" }}
                        >
                            <CardContent>
                                <Avatar
                                    sx={{
                                        bgcolor: "secondary.main",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <EcoIcon />
                                </Avatar>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "secondary.main",
                                    }}
                                >
                                    {loading ? "..." : allTreeData.length}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Unique Species
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            elevation={3}
                            sx={{ textAlign: "center", p: 2, height: "100%" }}
                        >
                            <CardContent>
                                <Avatar
                                    sx={{
                                        bgcolor: "success.main",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <ParkIcon />
                                </Avatar>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "success.main",
                                    }}
                                >
                                    {loading
                                        ? "..."
                                        : (totalTrees * 0.02).toFixed(2)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Estimated CO₂ Tons/Year
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            elevation={3}
                            sx={{ textAlign: "center", p: 2, height: "100%" }}
                        >
                            <CardContent>
                                <Avatar
                                    sx={{
                                        bgcolor: "info.main",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <TrendingUpIcon />
                                </Avatar>
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "info.main",
                                    }}
                                >
                                    2026
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Current Year
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Fade>

                {/* Species Breakdown */}
                <Fade in timeout={1400}>
                    <Paper
                        elevation={4}
                        sx={{
                            borderRadius: 3,
                            p: 4,
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                            sx={{
                                fontWeight: "bold",
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <NatureIcon color="primary" />
                            Species Distribution
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                fontStyle: "italic",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            Click on any species card to filter and view their
                            locations on the map
                        </Typography>

                        {/* Color Legend */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 3,
                                mb: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: "#F44336",
                                        borderRadius: "50%",
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {"< 2 trees"}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: "#FF9800",
                                        borderRadius: "50%",
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    2-5 trees
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: "#4CAF50",
                                        borderRadius: "50%",
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    6+ trees
                                </Typography>
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ width: "100%", mt: 2 }}>
                                <LinearProgress />
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, textAlign: "center" }}
                                >
                                    Loading species data...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "repeat(3, 1fr)",
                                            lg: "repeat(4, 1fr)",
                                        },
                                        gap: 3,
                                        mb: hasMoreSpecies ? 3 : 0,
                                    }}
                                >
                                    {displayData.map((species, index) => (
                                        <Card
                                            key={species.species}
                                            elevation={2}
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: 6,
                                                },
                                            }}
                                            onClick={() =>
                                                onSpeciesSelect?.(species.species)
                                            }
                                        >
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    variant="h2"
                                                    sx={{ mb: 1, fontSize: "2rem" }}
                                                >
                                                    {getSpeciesIcon(
                                                        species.species
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    component="div"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: getSpeciesColor(
                                                            species.count
                                                        ),
                                                        mb: 1,
                                                        minHeight: 48,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {species.species}
                                                </Typography>
                                                <Chip
                                                    label={`${species.count} trees`}
                                                    sx={{
                                                        bgcolor: getSpeciesColor(
                                                            species.count
                                                        ),
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        mb: 2,
                                                    }}
                                                />
                                                <Box sx={{ width: "100%", mt: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={species.percentage}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: "grey.200",
                                                            "& .MuiLinearProgress-bar":
                                                                {
                                                                    bgcolor:
                                                                        getSpeciesColor(
                                                                            species.count
                                                                        ),
                                                                    borderRadius: 4,
                                                                },
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {species.percentage.toFixed(
                                                            1
                                                        )}
                                                        % of total
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>

                                {/* View More/Less Button */}
                                {hasMoreSpecies && (
                                    <Box sx={{ textAlign: "center", mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleToggleShowAll}
                                            startIcon={
                                                showAll ? (
                                                    <ExpandLessIcon />
                                                ) : (
                                                    <ExpandMoreIcon />
                                                )
                                            }
                                            sx={{
                                                borderRadius: 3,
                                                px: 4,
                                                py: 1.5,
                                                borderColor: "primary.main",
                                                color: "primary.main",
                                                "&:hover": {
                                                    bgcolor: "primary.main",
                                                    color: "white",
                                                    transform: "translateY(-2px)",
                                                },
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {showAll
                                                ? "View Less Species"
                                                : `View All ${allTreeData.length} Species`}
                                        </Button>
                                        {!showAll && allTreeData.length > 8 && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 1 }}
                                            >
                                                Showing top 8 of {allTreeData.length} species
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>
                        )}

                        {!loading && allTreeData.length === 0 && (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <NatureIcon
                                    sx={{
                                        fontSize: 60,
                                        color: "grey.400",
                                        mb: 2,
                                    }}
                                />
                                <Typography variant="h6" color="text.secondary">
                                    No tree data available yet
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Start planting trees to see statistics here!
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default TreeStatistics;
