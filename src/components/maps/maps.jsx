import "./maps.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";

function Maps() {
  const [userPos, setUserPos] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err)
    );
  }, []);


  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("http://localhost:3001/v1/store/all");
        if (!res.ok) {
          console.error("Erreur API :", res.status);
          return;
        }
        const data = await res.json();
        setStores(
          data.map(store => ({
            ...store,
            latitude: Number(store.latitude),
            longitude: Number(store.longitude)
            })
          )
        );
      } catch (err) {
        console.error("Erreur fetch :", err);
      }
    }

    fetchStores();
  }, []);


  function SetViewOnUser() {
    const map = useMap();
    useEffect(() => {
      if (userPos) {
        map.setView([userPos.lat, userPos.lng], 14);
      }
    }, [userPos]);
    return null;
  }

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const updateMapHeight = () => {
      const mapContainer = map.getContainer();

      const rect = mapContainer.getBoundingClientRect();
      const topOffset = rect.top;

      const bottomMargin = 20;
      const availableHeight = window.innerHeight - topOffset - bottomMargin;

      mapContainer.style.height = `${availableHeight}px`;
      map.invalidateSize();
    };

    updateMapHeight();

    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, [map]);

  return null;
}




  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer 
        center={[50.4669, 4.8674]} 
        zoom={14} 
        style={
          {
            height: "100%",
            width: "100%"
          }
          }>
          
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ResizeMap />

        <SetViewOnUser />

        {userPos && (
          <CircleMarker center={[userPos.lat, userPos.lng]} radius={8} color="grey" fillColor="blue" fillOpacity={1}>
            <Popup>Vous êtes ici</Popup>
          </CircleMarker>
        )}

        {stores.map((store) => (
          <Marker key={store.id} position={[store.latitude, store.longitude]}>
            <Popup>
              <strong>{store.label}</strong>
              <br />
              {store.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Maps;
