import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography } from "@mui/material";
import { API_CONFIG, buildApiUrl } from "../config/api";

const GlobalTreeCount: React.FC = () => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TREES)).then((res) => {
            // If paginated, use count; else, use length
            setCount(res.data.count ?? res.data.length ?? 0);
        });
    }, []);

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                left: 16,
                bottom: 16,
                zIndex: 1200,
                bgcolor: "#388e3c",
                color: "white",
                px: 3,
                py: 1,
                borderRadius: 2,
                opacity: 0.95,
            }}
        >
            <Typography variant="subtitle2" fontWeight="bold">
                🌳 Global Trees Planted: {count}
            </Typography>
        </Paper>
    );
};

export default GlobalTreeCount;
