import React, { useState, useEffect } from 'react';
import { createTree } from '../api/trees';
import { TreeFormProps } from '../pages/Home';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

const TreeForm: React.FC<TreeFormProps> = ({ token, onSuccess, latitude, longitude, address }) => {
    const [species, setSpecies] = useState('');
    const [lat, setLat] = useState<string>(
        latitude !== null && latitude !== undefined ? latitude.toString() : ''
    );
    const [lng, setLng] = useState<string>(
        longitude !== null && longitude !== undefined ? longitude.toString() : ''
    );
    const [datePlanted, setDatePlanted] = useState('');
    const [addr, setAddr] = useState(address);
    const [photo, setPhoto] = useState<File | null>(null); // NEW

    // Update form fields when map selection changes
    useEffect(() => {
        setLat(latitude !== null ? latitude.toString() : '');
        setLng(longitude !== null ? longitude.toString() : '');
    }, [latitude, longitude]);

    useEffect(() => {
        setAddr(address);
    }, [address]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('species', species);
            formData.append('latitude', lat);
            formData.append('longitude', lng);
            formData.append('date_planted', datePlanted);
            formData.append('address', addr);
            if (photo) {
                formData.append('photo', photo);
            }
            await createTree(formData, token); // Pass FormData and token only
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Error adding tree');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3, maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Add a New Tree
            </Typography>
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Species"
                    value={species}
                    onChange={e => setSpecies(e.target.value)}
                    required
                />
                <TextField
                    label="Latitude"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    required
                />
                <TextField
                    label="Longitude"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    required
                />
                <TextField
                    label="Date Planted"
                    type="date"
                    value={datePlanted}
                    onChange={e => setDatePlanted(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    label="Address"
                    value={addr}
                    onChange={e => setAddr(e.target.value)}
                    required
                />
                {/* Photo upload */}
                <Button variant="outlined" component="label">
                    Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoChange}
                    />
                </Button>
                {photo && <Typography variant="body2">{photo.name}</Typography>}
                <Button type="submit" variant="contained" color="primary">
                    Add Tree
                </Button>
            </Box>
        </Paper>
    );
};

export default TreeForm;