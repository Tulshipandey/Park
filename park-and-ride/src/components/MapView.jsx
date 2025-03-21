import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);

  // Function to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <MapContainer center={[28.7041, 77.1025]} zoom={12} className="h-[400px] w-full rounded-lg shadow-md">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* User Live Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Current Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
