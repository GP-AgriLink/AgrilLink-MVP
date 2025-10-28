import React, { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

const LocationPicker = ({ setFormData }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [lat, lng],
        },
      }));
    },
  });

  return null;
};

export default LocationPicker;
