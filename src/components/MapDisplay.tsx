
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PigeonReport } from '@/lib/types';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect, useRef } from 'react';


// Fix for default icon issues with webpack
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;


interface HeatmapLayerProps {
  points: [number, number, number][];
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    // The 'heat' property is added by the leaflet.heat plugin
    const heatLayer = (L as any).heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        max: 1.0, 
        gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};


interface MapDisplayProps {
  reports: PigeonReport[];
}

export default function MapDisplay({ reports }: MapDisplayProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const bahiaBlancaCoords: [number, number] = [-38.7183, -62.2661];

    useEffect(() => {
        // This effect hook handles the initialization and cleanup of the map instance
        if (mapContainerRef.current && !mapInstanceRef.current) {
            // If the container exists and there's no map instance, create one.
            const map = L.map(mapContainerRef.current).setView(bahiaBlancaCoords, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapInstanceRef.current = map;
        }

        return () => {
            // Cleanup function: This will run when the component unmounts.
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove(); // Explicitly remove the map instance
                mapInstanceRef.current = null;  // Clear the ref
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

    useEffect(() => {
        // This effect syncs markers and heatmap with the map instance
        const map = mapInstanceRef.current;
        if (!map) return; // Do nothing if map is not initialized

        // Clear existing layers to prevent duplicates on re-render
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || (layer as any)._heat) {
                map.removeLayer(layer);
            }
        });

        const parseLocation = (location: string): [number, number] | null => {
            try {
                const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
                return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
            } catch (e) {
                return null;
            }
        };

        const validPoints = reports
            .map(report => {
                const coords = parseLocation(report.location);
                return coords ? { ...report, coords } : null;
            })
            .filter((point): point is PigeonReport & { coords: [number, number] } => point !== null);

        // Add Markers
        validPoints.forEach(point => {
            L.marker(point.coords)
                .addTo(map)
                .bindPopup(`<b>${point.pigeonCount} palomas</b><br />Reportado por: ${point.userEmail}<br />Fecha: ${new Date(point.timestamp).toLocaleString()}`);
        });

        // Add Heatmap
        const heatPoints: [number, number, number][] = validPoints.map(p => [p.coords[0], p.coords[1], p.pigeonCount]);
        if (heatPoints.length > 0) {
            (L as any).heatLayer(heatPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 18,
                max: 1.0,
                gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
            }).addTo(map);
        }

    }, [reports]); // Re-run this effect when reports data changes

  // The container div is now controlled by Leaflet directly via the ref
  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
