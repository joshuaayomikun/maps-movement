import { Icon, IconOptions } from "leaflet";

export interface TopoJSONProps {
  data: any,
  color: string,
  action?: string,
  defaultIcon: Icon<IconOptions>
  position:[number, number]
}