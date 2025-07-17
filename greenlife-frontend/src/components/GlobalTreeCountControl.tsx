import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { API_CONFIG, buildApiUrl } from '../config/api';

interface GlobalTreeCountControlProps {
    species: string;
    setSpecies: (s: string) => void;
}

const GlobalTreeCountControl: React.FC<GlobalTreeCountControlProps> = ({ species, setSpecies }) => {
    const [count, setCount] = useState<number>(0);
    const [speciesList, setSpeciesList] = useState<string[]>(['All']);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingDots, setLoadingDots] = useState<string>('');
    const map = useMap();

    // Animate loading dots
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                setLoadingDots(prev => {
                    if (prev === '') return '.';
                    if (prev === '.') return '..';
                    if (prev === '..') return '...';
                    return '';
                });
            }, 500);
        } else {
            setLoadingDots('');
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Fetch available species for the filter dropdown (only once)
    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TREES));
                const allSpecies = response.data.results
                    ? response.data.results.map((tree: any) => tree.species)
                    : response.data.map((tree: any) => tree.species);
                const uniqueSpecies = Array.from(new Set(allSpecies)).filter(Boolean) as string[];
                setSpeciesList(['All', ...uniqueSpecies]);
            } catch (error) {
                console.error('Error fetching species:', error);
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
                if (species !== 'All') url += `?species=${encodeURIComponent(species)}`;

                const response = await axios.get(url);
                setCount(response.data.count ?? response.data.length ?? 0);
            } catch (error) {
                console.error('Error fetching tree count:', error);
                setCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, [species]);

    useEffect(() => {
        const control = new L.Control({ position: 'bottomleft' });

        control.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-bar');
            div.style.background = '#388e3c';
            div.style.color = 'white';
            div.style.padding = '8px 16px';
            div.style.borderRadius = '8px';
            div.style.fontWeight = 'bold';
            div.style.fontSize = '14px';
            div.style.opacity = '0.95';
            div.innerHTML = `
                <div>
                    <label>Species: 
                        <select id="species-filter">
                            ${speciesList.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </label>
                    <br/>
                    🌳 Total Trees Planted So Far in 2025: ${loading ? `Calculating${loadingDots}` : count}
                </div>
            `;
            setTimeout(() => {
                const speciesSelect = div.querySelector('#species-filter') as HTMLSelectElement;
                if (speciesSelect) speciesSelect.value = species;
                speciesSelect?.addEventListener('change', e => setSpecies((e.target as HTMLSelectElement).value));
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
