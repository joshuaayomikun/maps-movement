import { Feature, GeoJsonProperties, Geometry, Point } from "geojson";
import { Icon, icon, IconOptions, LatLng, Layer, marker, PathOptions, StyleFunction } from "leaflet";
import React, { useRef, useEffect, useState } from "react";
import { GeoJSON, Marker, Popup, } from "react-leaflet";
import { io, Socket } from "socket.io-client";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";

interface TopoJSONProps {
  data: any,
  color: string,
  action: string,
  defaultIcon: Icon<IconOptions>
}
export default function TopoJSON(props: TopoJSONProps) {
  const layerRef = useRef(null);
  const { data, color, action, defaultIcon } = props;
  const numPts = data['features'][0]['geometry']['coordinates'].length
  const start = data['features'][0]['geometry']['coordinates'][numPts - 1]
  function addData(layer: any, jsonData: Topology<Objects<GeoJsonProperties>>) {
    // debugger
    if (jsonData.type === "Topology") {
      for (let key in jsonData.objects) {
        let geojson = topojson.feature(jsonData, jsonData.objects[key]);
        layer.addData(geojson);
      }
    } else {
      layer.addData(jsonData);
    }
  }

  function onEachFeature(feature: Feature<Geometry, any>, layer: Layer) {
    // layer.bindPopup("A place")
    // debugger
    if (typeof feature.properties !== "undefined") {
      const { VARNAME_3, NAME_0 } = feature.properties;
      if(VARNAME_3 && NAME_0) {
        layer.bindPopup(`${VARNAME_3}, ${NAME_0}`);
      }
    }
  }

  function onStyle(feature: Feature<Geometry, any>, layer: Layer) {
    // geoJsonFeature.
    return {
      stroke: true,
      color: color,
      weight: 6
    } as PathOptions;

  }

  function onPointToLayer(geojsonPOint:Feature<Point, any>, latlng: LatLng): Layer {
    return marker(latlng, {
      icon: defaultIcon
    });
  }

  useEffect(() => {
    const layer = layerRef.current;
    addData(layer, props.data);
  }, [props.data]);

  return (
    <>
    <GeoJSON pointToLayer={onPointToLayer} data={data} ref={layerRef} style={onStyle as StyleFunction} onEachFeature={onEachFeature} />
    { data && <><Marker position={[start[1], start[0]]} icon={defaultIcon}>
            <Popup>{action}</Popup>
          </Marker></>}
    </>
  );
}
