import React from 'react';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';
import { setMapCenter } from "../../../stores/parksSlice";
import { Park } from '../../../types';
import { getParksCenter } from '../../../utils/coordinatesUtils';


interface SelectLocationProps {
    allParks: Park[]
}

interface DrawCircleProps {
    onCircleDrawn: (center: L.LatLng, radius: number) => void
}

function DrawCircle({ onCircleDrawn }: DrawCircleProps) {
    const map = useMap();

    React.useEffect(() => {
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            edit: { featureGroup: drawnItems },
            draw: {
                polyline: false,
                polygon: false,
                rectangle: false,
                circlemarker: false,
                marker: false,
                circle: {
                    shapeOptions: {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.2
                    }
                }
            }
        });

        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, (event: any) => {
            const layer = event.layer;
            drawnItems.addLayer(layer);

            const center = layer.getLatLng();
            const radius = layer.getRadius(); // meters
            console.log('Circle drawn:', center, radius);

            onCircleDrawn(center, radius);
        });

    }, [map, onCircleDrawn]);

    return null;
};


function SelectLocation({ allParks }: SelectLocationProps) {

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

    const handleCircleDrawn = (center: L.LatLng, radius: number) => {
        console.log("Circle center:", center, "Radius:", radius);

    }

    return (
        <div className='tw:h-full tw:w-full tw:rounded-2xl tw:shadow tw:overflow-hidden tw:border tw:border-border'>
            { localMapCenter ? ( 
                <MapContainer
                    center={localMapCenter}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    zoom={15}
                    style={{ 
                        height: '100%', 
                        width: '100%', 
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DrawCircle onCircleDrawn={handleCircleDrawn} />
                </MapContainer>
            ) : (
                <div>
                    Loading map...
                </div>
            )}
        </div>
    )
};

export default SelectLocation;