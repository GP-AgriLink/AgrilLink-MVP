import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FlyToLocation = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, map.getZoom());
    }
  }, [coordinates, map]);

  return null;
};

export default FlyToLocation;
