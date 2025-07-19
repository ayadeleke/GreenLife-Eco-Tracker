import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

interface GlobalTreeCountControlProps {
    species: string;
    setSpecies: (s: string) => void;
}

const GlobalTreeCountControl: React.FC<GlobalTreeCountControlProps> = ({
    species,
    setSpecies,
}) => {
    const [count, setCount] = useState<number>(0);
    const [speciesList, setSpeciesList] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingDots, setLoadingDots] = useState<string>("");
    const map = useMap();

    // Animate loading dots
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                setLoadingDots((prev) => {
                    if (prev === "") return ".";
                    if (prev === ".") return "..";
                    if (prev === "..") return "...";
                    return "";
                });
            }, 500);
        } else {
            setLoadingDots("");
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Fetch available species for the filter dropdown (only once)
    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await axios.get(
                    buildApiUrl(API_CONFIG.ENDPOINTS.TREES)
                );
                const allSpecies = response.data.results
                    ? response.data.results.map((tree: any) => tree.species)
                    : response.data.map((tree: any) => tree.species);
                const uniqueSpecies = Array.from(new Set(allSpecies)).filter(
                    Boolean
                ) as string[];
                setSpeciesList(["All", ...uniqueSpecies]);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchSpecies();
    }, []);

    // Fetch count based on selected species (every time species changes)
    useEffect(() => {
        const fetchCount = async () => {
            setLoading(true);
            try {
                let url = buildApiUrl(API_CONFIG.ENDPOINTS.TREES);
                if (species !== "All")
                    url += `?species=${encodeURIComponent(species)}`;

                const response = await axios.get(url);
                setCount(response.data.count ?? response.data.length ?? 0);
            } catch (error) {
                console.error("Error fetching tree count:", error);
                setCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, [species]);

    useEffect(() => {
        const control = new L.Control({ position: "bottomleft" });

        control.onAdd = function () {
            const div = L.DomUtil.create(
                "div",
                "leaflet-bar modern-tree-control"
            );
            div.style.background = "rgba(255, 255, 255, 0.95)";
            div.style.backdropFilter = "blur(10px)";
            div.style.border = "1px solid rgba(0, 0, 0, 0.1)";
            div.style.borderRadius = "12px";
            div.style.padding = "16px";
            div.style.fontFamily = "system-ui, -apple-system, sans-serif";
            div.style.fontSize = "14px";
            div.style.minWidth = "280px";
            div.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";

            div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- Species Filter Section -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #2e7d32; font-weight: 600; font-size: 13px;">🌿 FILTER:</span>
                        <select id="species-filter" style="
                            flex: 1;
                            padding: 6px 10px;
                            border: 1px solid #e0e0e0;
                            border-radius: 8px;
                            background: white;
                            font-size: 13px;
                            color: #333;
                            cursor: pointer;
                            outline: none;
                            transition: border-color 0.2s ease;
                        ">
                            ${speciesList
                                .map(
                                    (s) => `<option value="${s}">${s}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
                    
                    <!-- Stats Section -->
                    <div style="
                        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                        color: white;
                        padding: 12px;
                        border-radius: 8px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                Trees Planted in 2025
                            </div>
                            <div style="font-size: 20px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                🌳 <span>${
                                    loading
                                        ? `Calculating${loadingDots}`
                                        : count.toLocaleString()
                                }</span>
                            </div>
                        </div>
                        <!-- Decorative background element -->
                        <div style="
                            position: absolute;
                            top: -20px;
                            right: -20px;
                            width: 60px;
                            height: 60px;
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            opacity: 0.3;
                        "></div>
                    </div>
                </div>
            `;

            // Add hover effect to select
            setTimeout(() => {
                const speciesSelect = div.querySelector(
                    "#species-filter"
                ) as HTMLSelectElement;
                if (speciesSelect) {
                    speciesSelect.value = species;

                    // Prevent map interactions when using the dropdown
                    L.DomEvent.disableClickPropagation(div);
                    L.DomEvent.disableScrollPropagation(div);

                    speciesSelect.addEventListener("change", (e) => {
                        e.stopPropagation();
                        setSpecies((e.target as HTMLSelectElement).value);
                    });

                    speciesSelect.addEventListener("click", (e) => {
                        e.stopPropagation();
                    });

                    speciesSelect.addEventListener("focus", () => {
                        speciesSelect.style.borderColor = "#4caf50";
                        speciesSelect.style.boxShadow =
                            "0 0 0 2px rgba(76, 175, 80, 0.2)";
                    });
                    speciesSelect.addEventListener("blur", () => {
                        speciesSelect.style.borderColor = "#e0e0e0";
                        speciesSelect.style.boxShadow = "none";
                    });
                }
            }, 0);
            return div;
        };

        control.addTo(map);

        return () => {
            control.remove();
        };
    }, [map, count, species, speciesList, setSpecies, loading, loadingDots]);

    return null;
};

export default GlobalTreeCountControl;
