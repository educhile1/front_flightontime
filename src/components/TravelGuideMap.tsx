
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PuntoInteres } from '../services/api';

// Fix for default Leaflet icons
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
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

interface TravelGuideMapProps {
    points: PuntoInteres[];
}

/**
 * Creates a custom DivIcon with the specified color
 */
const createCustomIcon = (colorHex: string) => {
    return L.divIcon({
        className: 'custom-pin',
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin" style="filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.4));">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="#FFFFFF"></circle>
        </svg>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -38]
    });
};

const MapUpdater: React.FC<{ points: PuntoInteres[] }> = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points && points.length > 0) {
            const latLngs = points.map(p => [p.coordenadas.lat, p.coordenadas.lng] as [number, number]);
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);

    return null;
};

export const TravelGuideMap: React.FC<TravelGuideMapProps> = ({ points }) => {
    // Calculate initial center (just fallback, updater will fix it)
    const initialCenter: [number, number] = points.length > 0
        ? [points[0].coordenadas.lat, points[0].coordenadas.lng]
        : [0, 0];

    return (
        <div className="w-full h-80 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
            <MapContainer
                center={initialCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater points={points} />

                {points.map((point, idx) => (
                    <Marker
                        key={idx}
                        position={[point.coordenadas.lat, point.coordenadas.lng]}
                        icon={createCustomIcon(point.color_hex || '#3B82F6')}
                    >
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white mb-1 inline-block" style={{ backgroundColor: point.color_hex || '#3B82F6' }}>
                                    {point.tipo}
                                </span>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{point.nombre}</h3>
                                <p className="text-xs text-gray-600 line-clamp-2">{point.comentario_experto}</p>
                                <a
                                    href={point.navegacion.gmaps_nav}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-2 text-xs font-bold text-blue-600 hover:underline"
                                >
                                    Abrir en Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
