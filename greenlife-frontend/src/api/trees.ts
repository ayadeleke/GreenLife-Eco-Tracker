import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

export const fetchTrees = () =>
    axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TREES));
export const fetchGeoJson = () =>
    axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.GEOJSON));
export const createTree = (data: any, token: string) =>
    axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.TREES), data, {
        headers: { Authorization: `Bearer ${token}` },
    });
