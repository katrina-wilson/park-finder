import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getParksCenter } from '../utils/coordinatesUtils';
import { Park } from '../types';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setMapCenter } from "../stores/parksSlice";


interface MapProps {
  allParks: Park[];
  searchFilterParks: Park[];
  selectedPark: Park | null;
  setSelectedPark: (park: Park | null) => void;
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


function Map({ allParks, searchFilterParks, selectedPark, setSelectedPark }: MapProps) {

  const dispatch = useDispatch();

  const [localMapCenter, setLocalMapCenter] = React.useState(null);

  const mapCenter = useSelector((state) => state.parks.mapCenter);

  React.useEffect(() => {
    if (allParks?.length > 0) {
      const center = mapCenter ?? getParksCenter(allParks);
      
      if (!mapCenter) {
        dispatch(setMapCenter(center));
      } 
      setLocalMapCenter(center);
    }
  }, [allParks, dispatch, mapCenter]);

  const center = selectedPark
    ? [selectedPark.lat, selectedPark.lon] as [number, number]
    : localMapCenter;

  if (!center) return null;

  const zoomLevel = selectedPark ? 15 : 10;


  return (
    <div className='tw:h-full tw:w-full tw:rounded-2xl tw:shadow tw:overflow-hidden tw:border tw:border-border'>
      { localMapCenter && 
        <MapContainer
          center={center}
          scrollWheelZoom={true}
          zoomControl={true}
          zoom={13}
          style={{ 
            height: '100%', 
            width: '100%', 
          }}
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
                    <div className='tw:text-lg tw:font-bold tw:pb-3'>
                      {p?.name}
                    </div>
                    <div className='tw:flex tw:w-full tw:justify-end'>
                      <Button 
                        variant='contained'
                        onClick={() => setSelectedPark(p)}
                      >
                        View Details
                      </Button>
                    </div>
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
    </div>
  );
}

export default Map;
