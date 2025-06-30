import React, { useState } from 'react';
import TreeMap from '../components/TreeMap';
import TreeForm from '../components/TreeForm';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { token } = useAuth();
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  return (
    <div>
      <TreeMap onLocationSelect={(lat, lng, address) => {
        setSelectedLat(lat);
        setSelectedLng(lng);
        setSelectedAddress(address || '');
      }} />
      {token && (
        <TreeForm
          token={token}
          onSuccess={() => window.location.reload()}
          latitude={selectedLat}
          longitude={selectedLng}
          address={selectedAddress}
        />
      )}
    </div>
  );
};

export interface TreeFormProps {
  token: string;
  onSuccess: () => void;
  latitude: number | null;
  longitude: number | null;
  address: string;
}

export default Home;