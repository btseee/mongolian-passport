import * as React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as geoUrl from "../data/features.json";

const WorldMap: React.FC = () => {
  return (
      <ComposableMap
        projectionConfig={{
          scale: 100,
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
      </ComposableMap>
  );
};

export default WorldMap;
