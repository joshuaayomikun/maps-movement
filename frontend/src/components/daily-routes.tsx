import { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import TopoJSON from './TopoJSON'
import 'leaflet/dist/leaflet.css';
import { Socket, io } from "socket.io-client";
import useSWR, { useSWRConfig } from "swr";
import { apiUrls } from "../constants/api-urls";
import { API_BASE_URL } from "../constants/env-constatnts";
import { goCarIcon, walkIcon, backCarIcon } from "../constants/icons";
import { Destination, Movement } from "../models/default-values";
import { destination, movement } from "../constants/default-values";


interface Posiion { x?: number, y?: number, i: number }
interface DailyRoutesProps {
  getStatus: (stat: Movement) => void,
  getDestination: (stat: Destination) => void,
  refresh: boolean
}

const DailyRoutes: FC<DailyRoutesProps> = (props: DailyRoutesProps) => {
  
  const [toLunch, setToLunch] = useState(false)
  useSWR(toLunch ? apiUrls.routeToLunch : null)
  useSWR(apiUrls.routeToOffice)
  const {mutate} = useSWRConfig()
  const [socket, setSocket] = useState<Socket>()
  const [topoJSON, setTopoJSON] = useState<any | null>()
  const [topoLunchJSON, setTopoLunchJSON] = useState<any | null>()
  const [toOfficeMarkerPosition, setToOfficeMarkerPosition] = useState<Posiion>()
  const [toLunchMarkerPosition, setToLunchMarkerPosition] = useState<Posiion>()
  const [backHomeMarkerPosition, setBackHomeMarkerPosition] = useState<Posiion>()

  useEffect(() => {
    const sock = io(API_BASE_URL)
    setSocket(sock)
  }, [])

  useEffect(() => {
    if(props.refresh) {
      setToLunch(false)
      mutate(apiUrls.routeToOffice)
      props.getStatus({...movement, starting: true})
      props.getDestination({...destination})
      setToOfficeMarkerPosition(undefined)
      setToLunchMarkerPosition(undefined)
      setBackHomeMarkerPosition(undefined)
    }
  }, [props.refresh])
  useEffect(() => {
    let a = setInterval(() => {
      if (topoLunchJSON && topoJSON) {
        const topoCoord = topoJSON['features'][0]['geometry']['coordinates']
        const topoLunchCoord = topoLunchJSON['features'][0]['geometry']['coordinates']

        if (!toOfficeMarkerPosition) {
          setToOfficeMarkerPosition((prev: Posiion | undefined) => {
            props.getDestination({ ...destination})
            props.getStatus({ ...movement, goingToOffice: true })
            return { x: topoCoord[0][0], y: topoCoord[0][1], i: 0 }
          })
        }
        if (toOfficeMarkerPosition) {
          setToOfficeMarkerPosition((prev: Posiion | undefined) => {

            if (prev && prev.i < (topoCoord.length - 1)) {
              props.getStatus({ ...movement, goingToOffice: true })
              return { x: topoCoord[prev.i + 1][0], y: topoCoord[prev.i + 1][1], i: prev.i + 1 }
            }
            return prev
          })

          if (!toLunchMarkerPosition && toOfficeMarkerPosition.i === (topoCoord.length - 1)) {
            props.getDestination({ ...destination, gotToOffice: true })
            setToLunchMarkerPosition((prev) => {
              props.getStatus({ ...movement, goingToLunch: true })
              return { x: topoLunchCoord[0][0], y: topoLunchCoord[0][1], i: 0 }
            })
          }

          if (toLunchMarkerPosition && toOfficeMarkerPosition.i >= (topoCoord.length - 1)) {
            setToLunchMarkerPosition((prev: Posiion | undefined) => {
              if (prev && prev.i < (topoLunchCoord.length - 1)) {
                props.getDestination({ ...destination})
                props.getStatus({ ...movement, goingToLunch: true })
                return { x: topoLunchCoord[prev.i + 1][0], y: topoLunchCoord[prev.i + 1][1], i: prev.i + 1 }
              }
              return prev
            })

            if (!backHomeMarkerPosition && toOfficeMarkerPosition.i >= (topoCoord.length - 1) && toLunchMarkerPosition.i === (topoLunchCoord.length - 1)) {
              props.getDestination({ ...destination, gotBackFromLunch: true })
              setBackHomeMarkerPosition((prev) => {
                props.getStatus({ ...movement, goingHome: true })
                return { x: topoCoord[(topoCoord.length - 1)][0], y: topoCoord[(topoCoord.length - 1)][1], i: (topoCoord.length - 1) }
              })
            }
            if (backHomeMarkerPosition && toOfficeMarkerPosition.i >= (topoCoord.length - 1) && toLunchMarkerPosition.i >= (topoLunchCoord.length - 1)) {
              setBackHomeMarkerPosition((prev) => {
                props.getDestination({ ...destination })
                props.getStatus({ ...movement, goingHome: true })
                if (prev && prev.i > 0) {
                  return { x: topoCoord[prev.i - 1][0], y: topoCoord[prev.i - 1][1], i: prev.i - 1 }
                }
                return prev
              })
            }
          }
        }
        if (toOfficeMarkerPosition && toLunchMarkerPosition && backHomeMarkerPosition && toOfficeMarkerPosition.i === (topoCoord.length - 1) && toLunchMarkerPosition.i === (topoLunchCoord.length - 1) && backHomeMarkerPosition.i === 0) {
          console.log("All done")
          clearInterval(a)
          props.getDestination({ ...destination, gotHome: true })
          props.getStatus({ ...movement, completed: true })
        }
      }
    }, 100)
    return () => {
      clearInterval(a)
    }
  }, [topoLunchJSON, topoJSON])

  useEffect(() => {
    props.getStatus({ ...movement, starting: true })
    if (socket) {
      socket.on('routeToOffice', (message) => {
        const parsedDaa = JSON.parse(message)
        if (parsedDaa) {
          setTopoJSON(parsedDaa)
        }
      });

      socket.on('routeToLunch', message => {
        setTopoLunchJSON(JSON.parse(message))
      })

    }
  }, [socket])

  useEffect(() => {
    if (topoJSON) {
      if (!toLunch) {
          setToLunch(true)
      }
    }
  }, [topoJSON, setToLunch])
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
      {topoJSON && toOfficeMarkerPosition && toOfficeMarkerPosition.i < (topoJSON['features'][0]['geometry']['coordinates'].length - 1) && <TopoJSON defaultIcon={goCarIcon} data={topoJSON} position={[toOfficeMarkerPosition.x, toOfficeMarkerPosition.y] as [number, number]} color={"green"} />}
      {topoLunchJSON && toLunchMarkerPosition && toLunchMarkerPosition.i < (topoLunchJSON['features'][0]['geometry']['coordinates'].length - 1) && <TopoJSON defaultIcon={walkIcon} position={[toLunchMarkerPosition.x, toLunchMarkerPosition.y] as [number, number]} data={topoLunchJSON} color={"red"} />}
      {topoJSON && backHomeMarkerPosition && backHomeMarkerPosition.i > 0 && <TopoJSON defaultIcon={backCarIcon} position={[backHomeMarkerPosition.x, backHomeMarkerPosition.y] as [number, number]} data={topoJSON} color={"blue"} />}
    </MapContainer>
  )
}
export default DailyRoutes