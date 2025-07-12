import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

interface GlobalTreeCountControlProps {
    species: string;
    setSpecies: (s: string) => void;
}

const GlobalTreeCountControl: React.FC<GlobalTreeCountControlProps> = ({ species, setSpecies }) => {
    const [count, setCount] = useState<number>(0);
    const [speciesList, setSpeciesList] = useState<string[]>(['All']);
    const map = useMap();

    // Fetch available species for the filter dropdown (only once)
    useEffect(() => {
        axios.get('http://134.149.216.180:8000/api/trees/')
            .then(res => {
                const allSpecies = res.data.results
                    ? res.data.results.map((tree: any) => tree.species)
                    : res.data.map((tree: any) => tree.species);
                const uniqueSpecies = Array.from(new Set(allSpecies)).filter(Boolean) as string[];
                setSpeciesList(['All', ...uniqueSpecies]);
            });
    }, []);

    // Fetch count based on selected species (every time species changes)
    useEffect(() => {
        let url = 'http://134.149.216.180:8000/api/trees/';
        if (species !== 'All') url += `?species=${encodeURIComponent(species)}`;

        axios.get(url)
            .then(res => {
                setCount(res.data.count ?? res.data.length ?? 0);
            });
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
                    🌳 Total Trees Planted So Far in 2025: ${count}
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
    }, [map, count, species, speciesList, setSpecies]);

    return null;
};

export default GlobalTreeCountControl;
