import axios from 'axios';

const API_URL = 'http://134.149.216.180:8000/api/trees/';

export const fetchTrees = () => axios.get(API_URL);
export const fetchGeoJson = () => axios.get(`${API_URL}geojson/`);
export const createTree = (data: any, token: string) =>
    axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } });
