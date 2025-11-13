import React, { useEffect, useRef } from 'react';
import { MapPin, Plane, Ship, Car } from 'lucide-react';

// Declaração para informar ao TypeScript sobre a variável global 'L' do Leaflet
declare const L: any;

const mockPostos = [
  { name: 'Aeroporto 4 de Fevereiro', type: 'Aéreo', coords: [-8.8583, 13.2322] },
  { name: 'Porto de Luanda', type: 'Marítimo', coords: [-8.8078, 13.2394] },
  { name: 'Posto Fronteiriço de Santa Clara', type: 'Terrestre', coords: [-17.3875, 15.8925] },
  { name: 'Posto Fronteiriço do Luvo', type: 'Terrestre', coords: [-6.11, 14.81] },
  { name: 'Porto do Lobito', type: 'Marítimo', coords: [-12.35, 13.54] },
];

const GisPage: React.FC = () => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Evita a reinicialização do mapa em re-renderizações
    if (mapRef.current) return;

    // Inicializa o mapa
    const map = L.map('map-container').setView([-11.2027, 17.8739], 6);
    mapRef.current = map;

    // Adiciona a camada de mapa base do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Função para criar ícones personalizados
    const createIcon = (type: 'Aéreo' | 'Marítimo' | 'Terrestre') => {
        let color = '#71717a'; // gray-500
        if (type === 'Aéreo') color = '#0ea5e9'; // sky-500
        if (type === 'Marítimo') color = '#3b82f6'; // blue-600
        if (type === 'Terrestre') color = '#4b5563'; // gray-600

        const iconHtml = `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
        return L.divIcon({
            html: iconHtml,
            className: 'custom-leaflet-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    };

    // Adiciona marcadores para cada posto
    mockPostos.forEach(posto => {
      const icon = createIcon(posto.type as any);
      L.marker(posto.coords, { icon })
        .addTo(map)
        .bindPopup(`<b>${posto.name}</b><br>${posto.type}`);
    });

    // Limpeza ao desmontar o componente
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Análise Geoespacial (GIS)</h1>
        <p className="text-gray-600">Visualização interativa dos postos fronteiriços e atividades operacionais.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-700">
                <span className="flex items-center"><Plane className="h-4 w-4 mr-2 text-sky-500"/> Aéreo</span>
                <span className="flex items-center"><Ship className="h-4 w-4 mr-2 text-blue-600"/> Marítimo</span>
                <span className="flex items-center"><Car className="h-4 w-4 mr-2 text-gray-600"/> Terrestre</span>
            </div>
        </div>
        <div 
          id="map-container" 
          className="w-full h-[600px] rounded-lg z-0"
          aria-label="Mapa interativo de Angola com postos fronteiriços"
        ></div>
      </div>
    </div>
  );
};

export default GisPage;
