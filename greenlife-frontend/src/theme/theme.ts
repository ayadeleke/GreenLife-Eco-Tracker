import { createTheme } from "@mui/material/styles";

// Declare module augmentation for custom theme colors
declare module "@mui/material/styles" {
    interface Palette {
        darkForest: {
            main: string;
        };
    }
    interface PaletteOptions {
        darkForest?: {
            main: string;
        };
    }
}

// Create a custom theme with green as primary color
const theme = createTheme({
    palette: {
        primary: {
            main: "#4CAF50", // Material Design Green 500
            light: "#81C784", // Material Design Green 300
            dark: "#2E7D32", // Material Design Green 800
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#9C27B0", // Material Design Purple 500
            light: "#CE93D8", // Material Design Purple 300
            dark: "#6A1B9A", // Material Design Purple 800
            contrastText: "#ffffff",
        },
        success: {
            main: "#4CAF50",
            light: "#81C784",
            dark: "#2E7D32",
        },
        info: {
            main: "#2196F3", // Material Design Blue 500
            light: "#64B5F6", // Material Design Blue 300
            dark: "#1976D2", // Material Design Blue 800
        },
        warning: {
            main: "#FF9800",
            light: "#FFB74D",
            dark: "#F57C00",
        },
        error: {
            main: "#F44336",
            light: "#E57373",
            dark: "#D32F2F",
        },
        background: {
            default: "#fafafa",
            paper: "#ffffff",
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
        },
        darkForest: {
            main: "#004419",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
