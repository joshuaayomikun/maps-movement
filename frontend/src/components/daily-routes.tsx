import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import TopoJSON from './TopoJSON'
import 'leaflet/dist/leaflet.css';
// import * as topojson from './popeye-village-balluta.geojson.json'
// import * as topoLunchjson from './lunch.geojson.json'
import { Socket, io } from "socket.io-client";
import useSWR from "swr";


const DailyROutes: FC = () => {
  const [toLunch, setToLunch] = useState(false)
  useSWR(toLunch ? 'http://localhost:3100/to-lunch' : null)
  useSWR('http://localhost:3100/to-office')
  const [socket, setSocket] = useState<Socket>()
  const [topoJSON, setTopoJSON] = useState<any | null>()
  const [reverseTopoJSON, setReverseTopoJSON] = useState<any | null>()
  const [topoLunchJSON, setTopoLunchJSON] = useState<any | null>()
  useEffect(() => {
    const sock = io('http://localhost:3100')
    setSocket(sock)
  }, [])

  useEffect(() => {

    if (socket) {
      socket.on('routeToOffice', (message) => {
        const parsedDaa = JSON.parse(message)

        setInterval(() => {
          console.log({ message: parsedDaa })
          setTopoJSON(parsedDaa)
        }, 10000)
      });

      socket.on('routeToLunch', message => {
        setTopoLunchJSON(JSON.parse(message))
      })

    }
  }, [socket])
  useEffect(() => {
    if (topoJSON) {
      setTimeout(() => {
        setReverseTopoJSON((prev: any) => {
          const cureentData = { ...prev }
          const newData = !prev ? { ...topoJSON } : { ...prev, ...topoJSON }
          newData['features'][0]['geometry']['coordinates'] = newData['features'][0]['geometry']['coordinates'].reverse()
          return newData
        })
      }, 300);
    }
  }, [topoJSON])
  return (
    <MapContainer
      center={[35.91504360132915, 14.495204687118528]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* {topoJSON && <TopoJSON data={topoJSON} color={"green"} />}
            {topoLunchJSON &&  <TopoJSON data={topoLunchJSON} color={"red"} />}
            {reverseTopoJSON &&  <TopoJSON data={reverseTopoJSON} color={"blue"} />} */}
    </MapContainer>
  )
}

export default DailyROutes

