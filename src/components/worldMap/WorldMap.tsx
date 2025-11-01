"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import useDarkMode from "@/hooks/darkMode";
import features from "@/data/features.json";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import { geoCentroid } from "d3-geo";

export type MapCategory = "diplomat" | "normal" | "special" | "other";

export interface MapSelection {
  iso3: string; // e.g., USA
}

interface WorldMapProps {
  selected?: MapSelection | null;
  onSelect: (iso3: string) => void;
  colorByIso3: Record<string, MapCategory>;
}

const fillFor = (category: MapCategory, theme: "dark" | "light") => {
  switch (category) {
    case "diplomat":
      return "#2563eb"; // blue-600
    case "normal":
      return "#16a34a"; // green-600
    case "special":
      return "#eab308"; // yellow-500
    default:
      return theme === "dark" ? "#334155" : "#E5E7EB"; // slate-700 / gray-200
  }
};

export default function WorldMap({
  selected,
  onSelect,
  colorByIso3,
}: WorldMapProps) {
  const { theme } = useDarkMode();
  const topo = features as unknown as any;
  const fc = useMemo(
    () => feature(topo, topo.objects.world) as FeatureCollection,
    [topo]
  );
  const centroidByIso3 = useMemo(() => {
    const map = new Map<string, [number, number]>();
    (fc.features as Feature<Geometry, any>[]).forEach((f: any) => {
      const id: string = f.id as string;
      try {
        const c = geoCentroid(f as any) as [number, number];
        if (
          Array.isArray(c) &&
          Number.isFinite(c[0]) &&
          Number.isFinite(c[1])
        ) {
          map.set(id, c);
        }
      } catch {}
    });
    return map;
  }, [fc]);

  const [center, setCenter] = useState<[number, number]>([0, 15]);
  const [zoom, setZoom] = useState(1);

  const animateTo = React.useCallback(
    (toCenter: [number, number], toZoom: number, duration = 400) => {
      const fromCenter = center;
      const fromZoom = zoom;
      const start = performance.now();
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); // easeInOutQuad
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const k = ease(t);
        const cx = fromCenter[0] + (toCenter[0] - fromCenter[0]) * k;
        const cy = fromCenter[1] + (toCenter[1] - fromCenter[1]) * k;
        const z = fromZoom + (toZoom - fromZoom) * k;
        setCenter([cx, cy]);
        setZoom(z);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [center, zoom]
  );

  useEffect(() => {
    if (selected?.iso3) {
      const c = centroidByIso3.get(selected.iso3);
      if (c) {
        animateTo(c, 2.4);
      }
    } else {
      animateTo([0, 15], 1);
    }
  }, [selected, centroidByIso3, animateTo]);

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projectionConfig={{ scale: 145 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={1}
          maxZoom={5}
          translateExtent={[
            [-1000, -500],
            [1000, 500],
          ]}
          onMoveEnd={({ coordinates, zoom }) => {
            setCenter(coordinates as [number, number]);
            setZoom(zoom);
          }}
        >
          <Geographies geography={features as any}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = (geo as any).id as string;
                const category = colorByIso3[iso3] ?? "other";
                const clickable = category !== "other";
                const isSelected = selected?.iso3 === iso3;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => clickable && onSelect(iso3)}
                    style={{
                      default: {
                        fill: isSelected
                          ? "#f97316"
                          : fillFor(
                              category,
                              theme === "dark" ? "dark" : "light"
                            ), // orange when active
                        stroke: theme === "dark" ? "#64748b" : "#94a3b8",
                        strokeWidth: 0.6,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        transition: "fill 200ms ease, transform 200ms ease",
                      },
                      hover: {
                        fill: isSelected
                          ? "#fb923c"
                          : clickable
                          ? "#60a5fa"
                          : fillFor(
                              category,
                              theme === "dark" ? "dark" : "light"
                            ),
                        outline: "none",
                      },
                      pressed: {
                        fill: isSelected
                          ? "#ea580c"
                          : clickable
                          ? "#3b82f6"
                          : fillFor(
                              category,
                              theme === "dark" ? "dark" : "light"
                            ),
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
