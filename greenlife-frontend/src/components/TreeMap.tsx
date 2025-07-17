import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import GlobalTreeCountControl from './GlobalTreeCountControl';
import LoadingSpinner from './LoadingSpinner';
import treeIconUrl from '../assets/tree-icon.png';
import { API_CONFIG, buildApiUrl } from '../config/api';

const treeIcon = new L.Icon({
    iconUrl: treeIconUrl,
    iconSize: [24, 24],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
});

interface TreeMapProps {
    onLocationSelect?: (lat: number, lng: number, address?: string) => void;
}

const SearchControl = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address?: string) => void }) => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new (GeoSearchControl as any)({
            provider,
            style: 'bar',
            showMarker: true,
            showPopup: false,
            marker: {
                icon: new L.Icon.Default(),
                draggable: true,
            },
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            searchLabel: 'Search for a location',
            position: 'bottomleft',
        });

        map.addControl(searchControl);

        map.on('geosearch/showlocation', async (result: any) => {
            const { x, y, label } = result.location;
            onLocationSelect(y, x, label); // y = lat, x = lng, label = address
        });

        return () => {
            map.removeControl(searchControl);
        };
    }, [map, onLocationSelect]);

    return null;
};

// This component listens for map clicks and calls onLocationSelect
const LocationPicker: React.FC<{ onLocationSelect: (lat: number, lng: number, address?: string) => void }> = ({ onLocationSelect }) => {
    useMapEvents({
        async click(e) {
            // Reverse geocode to get address
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
            const data = await res.json();
            onLocationSelect(e.latlng.lat, e.latlng.lng, data.display_name || '');
        },
    });
    return null;
};

const TreeMap: React.FC<TreeMapProps> = ({ onLocationSelect }) => {
    const [trees, setTrees] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);
    const [pickedAddress, setPickedAddress] = useState<string>('');
    const [species, setSpecies] = useState('All');
    const center: [number, number] = [0, 0];

    useEffect(() => {
        const fetchTrees = async () => {
            setLoading(true);
            try {
                let url = buildApiUrl(API_CONFIG.ENDPOINTS.TREES);
                if (species !== 'All') url += `?species=${encodeURIComponent(species)}`;
                const response = await axios.get(url);
                setTrees(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching trees:', error);
                setTrees([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrees();
    }, [species]);

    // Handler for both search and click
    const handleLocationSelect = (lat: number, lng: number, address?: string) => {
        setPickedLocation([lat, lng]);
        setPickedAddress(address || '');
        if (onLocationSelect) onLocationSelect(lat, lng, address);
    };

    // Current location button
    const mapRef = React.useRef<any>(null);
    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                // Reverse geocode
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                handleLocationSelect(lat, lng, data.display_name || '');
                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 15);
                }
            });
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <LoadingSpinner show={loading} message="Loading Map..." />
            <button
                style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: 10,
                    right: 10,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer'
                }}
                title="Use current location"
                onClick={handleCurrentLocation}
            >
                📍
            </button>
            <MapContainer
                center={center}
                zoom={2}
                style={{ height: '400px', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {onLocationSelect && <SearchControl onLocationSelect={handleLocationSelect} />}
                {onLocationSelect && <LocationPicker onLocationSelect={handleLocationSelect} />}
                {pickedLocation && (
                    <Marker position={pickedLocation} icon={treeIcon}>
                        <Popup>
                            Selected Location<br />
                            {pickedAddress}
                        </Popup>
                    </Marker>
                )}
                {trees.filter(tree => species === 'All' || tree.species === species).map((tree: any) => (
                    <Marker key={tree.id} position={[tree.latitude, tree.longitude]} icon={treeIcon}>
                        <Popup>
                            <b>{tree.species}</b><br />
                            Planted: {tree.date_planted}<br />
                            By: {tree.user}<br />
                        </Popup>
                    </Marker>
                ))}
                <GlobalTreeCountControl species={species} setSpecies={setSpecies} />
            </MapContainer>
        </div>
    );
};

export default TreeMap;

