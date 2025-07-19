import React, { useEffect } from "react";

interface LoadingSpinnerProps {
    message?: string;
    show: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Loading...",
    show,
}) => {
    // Add the spinner animation
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (!show) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#2e7d32",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid #e0e0e0",
                        borderTop: "4px solid #2e7d32",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                ></div>
                {message}
            </div>
        </div>
    );
};

export default LoadingSpinner;
