import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Divider,
    Link,
    IconButton,
} from "@mui/material";
import {
    Park as TreeIcon,
    LocalFlorist as EcoIcon,
    Public as GlobalIcon,
    Co2 as CarbonIcon,
    Groups as CommunityIcon,
    Info as InfoIcon,
    ContactSupport as SupportIcon,
    Article as GuideIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
} from "@mui/icons-material";

interface FooterProps {
    globalStats?: {
        totalTrees: number;
        totalUsers: number;
        carbonOffset: number;
        speciesCount: number;
    };
}

const Footer: React.FC<FooterProps> = ({
    globalStats = {
        totalTrees: 15420,
        totalUsers: 1280,
        carbonOffset: 3850,
        speciesCount: 84,
    },
}) => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Conservation",
            links: [
                { label: "About Our Mission", href: "/#" },
                { label: "Tree Planting Guide", href: "/#" },
                { label: "Environmental Impact", href: "/#" },
                { label: "Partner Organizations", href: "/#" },
            ],
        },
        {
            title: "Community",
            links: [
                { label: "Join the Movement", href: "/register" },
                { label: "Community Guidelines", href: "/#s" },
                { label: "Success Stories", href: "/#" },
                { label: "Events & Workshops", href: "/#" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "Help Center", href: "/#" },
                { label: "Contact Us", href: "/#" },
                { label: "Report Issues", href: "/#" },
                { label: "Privacy Policy", href: "/#" },
            ],
        },
    ];

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <Box
            component="footer"
            sx={{
                mt: 8,
                background:
                    "linear-gradient(180deg, #1B5E20 0%, #0D4F16 50%, #004419)",
                color: "white",
                pt: 6,
                pb: 3,
            }}
        >
            <Container maxWidth="lg">
                {/* Global Impact Stats Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                >
                    <Box textAlign="center" mb={3}>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: "bold", mb: 1 }}
                        >
                            🌍 Global Conservation Impact
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Together, we're making a difference for our planet
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 calc(50% - 12px)",
                                    md: "1 1 calc(25% - 12px)",
                                },
                                minWidth: 200,
                            }}
                        >
                            <Box textAlign="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1,
                                    }}
                                >
                                    <TreeIcon
                                        sx={{
                                            fontSize: 28,
                                            mr: 1,
                                            color: "#81C784",
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {formatNumber(globalStats.totalTrees)}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                >
                                    Trees Planted
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 calc(50% - 12px)",
                                    md: "1 1 calc(25% - 12px)",
                                },
                                minWidth: 200,
                            }}
                        >
                            <Box textAlign="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1,
                                    }}
                                >
                                    <CommunityIcon
                                        sx={{
                                            fontSize: 28,
                                            mr: 1,
                                            color: "#64B5F6",
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {formatNumber(globalStats.totalUsers)}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                >
                                    Active Planters
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 calc(50% - 12px)",
                                    md: "1 1 calc(25% - 12px)",
                                },
                                minWidth: 200,
                            }}
                        >
                            <Box textAlign="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1,
                                    }}
                                >
                                    <CarbonIcon
                                        sx={{
                                            fontSize: 28,
                                            mr: 1,
                                            color: "#FFB74D",
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {formatNumber(globalStats.carbonOffset)}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                >
                                    Tons CO₂ Offset
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                flex: {
                                    xs: "1 1 calc(50% - 12px)",
                                    md: "1 1 calc(25% - 12px)",
                                },
                                minWidth: 200,
                            }}
                        >
                            <Box textAlign="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1,
                                    }}
                                >
                                    <EcoIcon
                                        sx={{
                                            fontSize: 28,
                                            mr: 1,
                                            color: "#CE93D8",
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {globalStats.speciesCount}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                >
                                    Species Protected
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Links Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        mb: 4,
                        ml: { xs: 3, sm: 15 },
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {footerLinks.map((section, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: {
                                    xs: "1 1 100%",
                                    md: "1 1 calc(33.333% - 16px)",
                                },
                                minWidth: 250,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", mb: 2 }}
                            >
                                {section.title}
                            </Typography>
                            <Box>
                                {section.links.map((link, linkIndex) => (
                                    <Link
                                        key={linkIndex}
                                        href={link.href}
                                        sx={{
                                            display: "block",
                                            color: "rgba(255, 255, 255, 0.8)",
                                            textDecoration: "none",
                                            py: 0.5,
                                            "&:hover": {
                                                color: "white",
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mb: 3 }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 1 }}
                        >
                            GreenLife Eco Tracker
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            © {currentYear} GreenLife Conservation Initiative.
                            Building a sustainable future, one tree at a time.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                            href="https://tinyurl.com/dafavored"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                "&:hover": { color: "white" },
                            }}
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            href="https://tinyurl.com/greeengoal"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                "&:hover": { color: "white" },
                            }}
                        >
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Environmental Tip */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 2,
                        textAlign: "center",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, fontStyle: "italic" }}
                    >
                        💡 <strong>Did you know?</strong> A single mature tree
                        can absorb ~21kg/48lb of CO₂ per year and produce enough
                        oxygen for two people!
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
