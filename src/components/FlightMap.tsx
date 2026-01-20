
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importar imágenes de marcadores de Leaflet manualmente para evitar problemas de ruta
// Nota: En Vite/Webpack a veces se necesitan importar explícitamente o configurar assets
// Usaremos URLs públicas de CDN para asegurar funcionalidad inmediata sin configurar loaders
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Airport {
    id: number;
    name: string;
    city: string;
    latitude: number;
    longitude: number;
}

interface FlightMapProps {
    origin: Airport | null;
    destination: Airport | null;
}

// Componente auxiliar para ajustar el zoom/centro automáticamente
const MapUpdater: React.FC<{ origin: Airport | null, destination: Airport | null }> = ({ origin, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (origin && destination) {
            const lat1 = Number(origin.latitude);
            const lng1 = Number(origin.longitude);
            const lat2 = Number(destination.latitude);
            const lng2 = Number(destination.longitude);

            const bounds = L.latLngBounds(
                [lat1, lng1],
                [lat2, lng2]
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (origin) {
            map.setView([Number(origin.latitude), Number(origin.longitude)], 10);
        } else if (destination) {
            map.setView([Number(destination.latitude), Number(destination.longitude)], 10);
        }
    }, [origin, destination, map]);

    return null;
};

export const FlightMap: React.FC<FlightMapProps> = ({ origin, destination }) => {
    // Debugging coordinates
    console.log("FlightMap Props:", { origin, destination });

    // Centro inicial por defecto
    const defaultCenter: [number, number] = [0, 0];
    const defaultZoom = 2;

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border-4 border-white relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater origin={origin} destination={destination} />

                {origin && (
                    <Marker position={[Number(origin.latitude), Number(origin.longitude)]}>
                        <Popup>
                            <strong>Origen:</strong> {origin.city} ({origin.name})
                        </Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker position={[Number(destination.latitude), Number(destination.longitude)]}>
                        <Popup>
                            <strong>Destino:</strong> {destination.city} ({destination.name})
                        </Popup>
                    </Marker>
                )}

                {origin && destination && (
                    <Polyline
                        positions={[
                            [Number(origin.latitude), Number(origin.longitude)],
                            [Number(destination.latitude), Number(destination.longitude)]
                        ]}
                        color="red"
                        dashArray="10, 10"
                        weight={4}
                    />
                )}
            </MapContainer>
        </div>
    );
};
