import { Feature, GeoJsonProperties, Geometry, Point } from "geojson";
import { LatLng, Layer, marker, PathOptions, StyleFunction } from "leaflet";
import { useRef, useEffect, useCallback } from "react";
import { GeoJSON, Marker, Popup, } from "react-leaflet";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import { TopoJSONProps } from "../models/props";

export default function TopoJSON(props: TopoJSONProps) {
  const layerRef = useRef(null);
  const { data, color, action, defaultIcon, position } = props;

  const addData = useCallback((layer: any, jsonData: Topology<Objects<GeoJsonProperties>>) => {
    if (jsonData.type === "Topology") {
      for (let key in jsonData.objects) {
        let geojson = topojson.feature(jsonData, jsonData.objects[key]);
        layer.addData(geojson);
      }
    } else {
      layer.addData(jsonData);
    }
  }, [])

  const onEachFeature = useCallback((feature: Feature<Geometry, any>, layer: Layer) => {
    if (typeof feature.properties !== "undefined") {
      const { VARNAME_3, NAME_0 } = feature.properties;
      if (VARNAME_3 && NAME_0) {
        layer.bindPopup(`${VARNAME_3}, ${NAME_0}`);
      }
    }
  }, [])

  const onStyle = useCallback((feature: Feature<Geometry, any>, layer: Layer) => {
    return {
      stroke: true,
      color: color,
      weight: 6
    } as PathOptions;

  }, [])

  const onPointToLayer = useCallback((geojsonPOint: Feature<Point, any>, latlng: LatLng): Layer => {
    return marker(latlng, {
      icon: defaultIcon
    });
  }, [])

  useEffect(() => {
    const layer = layerRef.current;
    addData(layer, props.data);
  }, [props.data]);

  return (
    <>
      <GeoJSON pointToLayer={onPointToLayer} data={data} ref={layerRef} style={onStyle as StyleFunction} onEachFeature={onEachFeature} />
      {position[0] && <><Marker position={[position[1], position[0]]} icon={defaultIcon}>
        <Popup>{action}</Popup>
      </Marker></>}
    </>
  );
}
