import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getParksCenter } from '../utils/coordinatesUtils';
import { Park } from '../types';


// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  allParks: Park[];
  searchFilterParks: Park[];
  selectedPark: Park | null;
};

interface ZoomToParkProps {
  center: [number, number];
  zoom: number;
}

function ZoomToPark({ center, zoom }: ZoomToParkProps) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};


function Map({ allParks, searchFilterParks, selectedPark }: MapProps) {

  const [mapCenter, setMapCenter] = React.useState(null);

  React.useEffect(() => {
    if (allParks?.length > 0) {
      const center = getParksCenter(allParks);
      setMapCenter(center);
    }
  }, [allParks]);

  const center = selectedPark
    ? [selectedPark.lat, selectedPark.lon] as [number, number]
    : mapCenter;

  if (!center) return null;

  const zoomLevel = selectedPark ? 15 : 10;


  return (
    <>
      { mapCenter && 
        <MapContainer
          center={center}
          scrollWheelZoom={true}
          zoomControl={true}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {allParks?.length && allParks.map((p) => {
            return (
              <>
                <Marker 
                  key={p?.id}
                  position={[p?.lat, p?.lon]}
                >
                  <Popup>
                    {p?.name}
                  </Popup>
                </Marker>
              </>
            )
          })}

          <ZoomToPark 
            center={center} 
            zoom={zoomLevel}
          />

        </MapContainer>
      }
    </>
  );
}

export default Map;
