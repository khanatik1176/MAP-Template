'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';
import { MapPin, X } from 'lucide-react';

/*
  NOTE (how to get precise geojson):
  - Put precise GeoJSON files named bd-divisions.json and bd-districts.json into either:
      1) app/(dashboards)/map/_components/data/  (bundled with the app; the code will try `import` first)
      2) public/ (root public) as /bd-divisions.json and /bd-districts.json (the code will try fetch('/bd-divisions.json'))
  - Example commands (project root):
      mkdir -p app/(dashboards)/map/_components/data
      curl -L -o app/(dashboards)/map/_components/data/bd-divisions.json  "https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/divisions.json"
      curl -L -o app/(dashboards)/map/_components/data/bd-districts.json  "https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/districts.json"
*/

const DIVISIONS = [
  { name: 'Dhaka', color: '#FF6B6B' },
  { name: 'Chittagong', color: '#4ECDC4' },
  { name: 'Rajshahi', color: '#45B7D1' },
  { name: 'Khulna', color: '#96CEB4' },
  { name: 'Barishal', color: '#FFEAA7' },
  { name: 'Sylhet', color: '#DFE6E9' },
  { name: 'Rangpur', color: '#A29BFE' },
  { name: 'Mymensingh', color: '#FD79A8' }
];

const DISTRICTS = [
  { name: 'Dhaka', division: 'Dhaka', color: '#E74C3C' },
  { name: 'Gazipur', division: 'Dhaka', color: '#E67E22' },
  { name: 'Tangail', division: 'Dhaka', color: '#F39C12' },
  { name: 'Manikganj', division: 'Dhaka', color: '#F1C40F' },
  { name: 'Narsingdi', division: 'Dhaka', color: '#52C41A' },
  { name: 'Kishoreganj', division: 'Dhaka', color: '#16A085' },
  { name: 'Munshiganj', division: 'Dhaka', color: '#D35400' },
  { name: 'Narayanganj', division: 'Dhaka', color: '#C0392B' },
  { name: 'Faridpur', division: 'Dhaka', color: '#8E44AD' },
  { name: 'Gopalganj', division: 'Dhaka', color: '#2980B9' },
  { name: 'Madaripur', division: 'Dhaka', color: '#27AE60' },
  { name: 'Rajbari', division: 'Dhaka', color: '#F39C12' },
  { name: 'Shariatpur', division: 'Dhaka', color: '#D35400' },

  { name: 'Chittagong', division: 'Chittagong', color: '#1890FF' },
  { name: "Cox's Bazar", division: 'Chittagong', color: '#2F54EB' },
  { name: 'Rangamati', division: 'Chittagong', color: '#722ED1' },
  { name: 'Bandarban', division: 'Chittagong', color: '#EB2F96' },
  { name: 'Khagrachari', division: 'Chittagong', color: '#FA8C16' },
  { name: 'Feni', division: 'Chittagong', color: '#13C2C2' },
  { name: 'Lakshmipur', division: 'Chittagong', color: '#52C41A' },
  { name: 'Comilla', division: 'Chittagong', color: '#FA541C' },
  { name: 'Noakhali', division: 'Chittagong', color: '#F759AB' },
  { name: 'Brahmanbaria', division: 'Chittagong', color: '#597EF7' },
  { name: 'Chandpur', division: 'Chittagong', color: '#9254DE' },

  { name: 'Rajshahi', division: 'Rajshahi', color: '#13C2C2' },
  { name: 'Bogura', division: 'Rajshahi', color: '#52C41A' },
  { name: 'Pabna', division: 'Rajshahi', color: '#FA8C16' },
  { name: 'Sirajganj', division: 'Rajshahi', color: '#EB2F96' },
  { name: 'Natore', division: 'Rajshahi', color: '#722ED1' },
  { name: 'Naogaon', division: 'Rajshahi', color: '#2F54EB' },
  { name: 'Chapainawabganj', division: 'Rajshahi', color: '#FA541C' },
  { name: 'Joypurhat', division: 'Rajshahi', color: '#F759AB' },

  { name: 'Khulna', division: 'Khulna', color: '#FA8C16' },
  { name: 'Satkhira', division: 'Khulna', color: '#FA541C' },
  { name: 'Jessore', division: 'Khulna', color: '#13C2C2' },
  { name: 'Narail', division: 'Khulna', color: '#52C41A' },
  { name: 'Magura', division: 'Khulna', color: '#EB2F96' },
  { name: 'Jhenaidah', division: 'Khulna', color: '#722ED1' },
  { name: 'Bagerhat', division: 'Khulna', color: '#2F54EB' },
  { name: 'Chuadanga', division: 'Khulna', color: '#F759AB' },
  { name: 'Kushtia', division: 'Khulna', color: '#597EF7' },
  { name: 'Meherpur', division: 'Khulna', color: '#9254DE' },

  { name: 'Barishal', division: 'Barishal', color: '#EB2F96' },
  { name: 'Patuakhali', division: 'Barishal', color: '#C41D7F' },
  { name: 'Bhola', division: 'Barishal', color: '#FA541C' },
  { name: 'Pirojpur', division: 'Barishal', color: '#F759AB' },
  { name: 'Jhalokathi', division: 'Barishal', color: '#597EF7' },
  { name: 'Barguna', division: 'Barishal', color: '#9254DE' },

  { name: 'Sylhet', division: 'Sylhet', color: '#597EF7' },
  { name: 'Moulvibazar', division: 'Sylhet', color: '#2F54EB' },
  { name: 'Habiganj', division: 'Sylhet', color: '#722ED1' },
  { name: 'Sunamganj', division: 'Sylhet', color: '#9254DE' },

  { name: 'Rangpur', division: 'Rangpur', color: '#9254DE' },
  { name: 'Dinajpur', division: 'Rangpur', color: '#722ED1' },
  { name: 'Gaibandha', division: 'Rangpur', color: '#2F54EB' },
  { name: 'Kurigram', division: 'Rangpur', color: '#597EF7' },
  { name: 'Lalmonirhat', division: 'Rangpur', color: '#F759AB' },
  { name: 'Nilphamari', division: 'Rangpur', color: '#FA541C' },
  { name: 'Panchagarh', division: 'Rangpur', color: '#EB2F96' },
  { name: 'Thakurgaon', division: 'Rangpur', color: '#13C2C2' },

  { name: 'Mymensingh', division: 'Mymensingh', color: '#FF85C0' },
  { name: 'Jamalpur', division: 'Mymensingh', color: '#F759AB' },
  { name: 'Netrokona', division: 'Mymensingh', color: '#EB2F96' },
  { name: 'Sherpur', division: 'Mymensingh', color: '#C41D7F' }
];

export default function MapContent() {
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');
  const [useFallbackCentroids, setUseFallbackCentroids] = useState(false);

  const LRef = useRef<typeof Leaflet | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const divisionLayerRef = useRef<Leaflet.Layer | null>(null);
  const districtLayerRef = useRef<Leaflet.Layer | null>(null);
  const allDivisionsLayerRef = useRef<Leaflet.GeoJSON | null>(null);
  const allDistrictsLayerRef = useRef<Leaflet.GeoJSON | null>(null);
  const divisionGeoJsonRef = useRef<any>(null);
  const districtGeoJsonRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInitializedRef = useRef(false);

  const defaultCenter: [number, number] = [23.8103, 90.4125];
  const defaultZoom = 7;

  useEffect(() => setIsClient(true), []);

  const filteredDistricts = useMemo(() => {
    if (!selectedDivision) return DISTRICTS;
    return DISTRICTS.filter(d => d.division === selectedDivision);
  }, [selectedDivision]);

  const DIVISION_CENTROIDS: Record<string, [number, number]> = {
    Dhaka: [23.8103, 90.4125],
    Chittagong: [22.3569, 91.7832],
    Rajshahi: [24.3745, 88.6042],
    Khulna: [22.8456, 89.5403],
    Barishal: [22.7010, 90.3535],
    Sylhet: [24.9045, 91.8611],
    Rangpur: [25.7439, 89.2752],
    Mymensingh: [24.7471, 90.4203]
  };

  const makeSquareFeature = (name: string, center: [number, number], halfSizeKm: number) => {
    const lat = center[0];
    const lon = center[1];
    const halfLatDeg = halfSizeKm / 111.0;
    const halfLonDeg = halfSizeKm / (111.0 * Math.cos((lat * Math.PI) / 180));
    const coords: [number, number][] = [
      [lon - halfLonDeg, lat - halfLatDeg],
      [lon + halfLonDeg, lat - halfLatDeg],
      [lon + halfLonDeg, lat + halfLatDeg],
      [lon - halfLonDeg, lat + halfLatDeg],
      [lon - halfLonDeg, lat - halfLatDeg]
    ];
    return {
      type: 'Feature',
      properties: { name },
      geometry: { type: 'Polygon', coordinates: [coords] }
    };
  };

  const tryFetchGeoJSON = async (url: string) => {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} (${url})`);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/json') || ct.includes('application/geo+json')) {
      try {
        return await res.json();
      } catch {
        // fall through
      }
    }
    const text = await res.text();
    const cleaned = text.replace(/^\uFEFF/, '').trim();
    const match = cleaned.match(/({[\s\S]*}|\[[\s\S]*\])/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        throw new Error(`Failed to parse extracted JSON from ${url}: ${String(err)}`);
      }
    }
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`Failed to parse response from ${url}: ${String(err)}`);
    }
  };

  useEffect(() => {
    if (!isClient) return;
    if (mapInitializedRef.current) return;
    if (!mapContainerRef.current) return;

    let cancelled = false;

    (async () => {
      const mod = await import('leaflet');
      if (cancelled) return;
      const L = (mod as any).default ?? mod;
      LRef.current = L;

      // icon fix
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current as HTMLDivElement, {
        center: defaultCenter,
        zoom: defaultZoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const divisionUrlsFallback = [
        'https://cdn.jsdelivr.net/gh/geodatanz/bangladesh-geojson@master/divisions.json',
        'https://cdn.jsdelivr.net/gh/mohosinmiah/BD-Geo-JSON@master/division.geojson',
        'https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/divisions.json',
        'https://raw.githubusercontent.com/mohosinmiah/BD-Geo-JSON/master/division.geojson'
      ];
      const districtUrlsFallback = [
        'https://cdn.jsdelivr.net/gh/geodatanz/bangladesh-geojson@master/districts.json',
        'https://cdn.jsdelivr.net/gh/mohosinmiah/BD-Geo-JSON@master/district.geojson',
        'https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/districts.json',
        'https://raw.githubusercontent.com/mohosinmiah/BD-Geo-JSON/master/district.geojson'
      ];

      let divisionLoaded = false;
      let districtLoaded = false;
      let lastDivisionError: Error | null = null;
      let lastDistrictError: Error | null = null;

      try {
        // try bundled data import (if present)
        // @ts-ignore
        const divisionsModule = await import('./data/bd-divisions.json');
        // @ts-ignore
        const districtsModule = await import('./data/bd-districts.json');
        divisionGeoJsonRef.current = divisionsModule.default ?? divisionsModule;
        districtGeoJsonRef.current = districtsModule.default ?? districtsModule;

        allDivisionsLayerRef.current = L.geoJSON(divisionGeoJsonRef.current, {
          style: { fillColor: 'transparent', weight: 2, opacity: 0.3, color: '#666', fillOpacity: 0 }
        }).addTo(map);

        allDistrictsLayerRef.current = L.geoJSON(districtGeoJsonRef.current, {
          style: { fillColor: 'transparent', weight: 1, opacity: 0.2, color: '#999', fillOpacity: 0 }
        }).addTo(map);

        divisionLoaded = true;
        districtLoaded = true;
      } catch {
        // continue to fetch attempts
      }

      if (!divisionLoaded) {
        try {
          const geo = await tryFetchGeoJSON('/bd-divisions.json');
          divisionGeoJsonRef.current = geo;
          allDivisionsLayerRef.current = L.geoJSON(geo, {
            style: { fillColor: 'transparent', weight: 2, opacity: 0.3, color: '#666', fillOpacity: 0 }
          }).addTo(map);
          divisionLoaded = true;
        } catch (err) {
          lastDivisionError = err as Error;
        }
      }

      if (!districtLoaded) {
        try {
          const geo = await tryFetchGeoJSON('/bd-districts.json');
          districtGeoJsonRef.current = geo;
          allDistrictsLayerRef.current = L.geoJSON(geo, {
            style: { fillColor: 'transparent', weight: 1, opacity: 0.2, color: '#999', fillOpacity: 0 }
          }).addTo(map);
          districtLoaded = true;
        } catch (err) {
          lastDistrictError = err as Error;
        }
      }

      if (!divisionLoaded) {
        for (const url of divisionUrlsFallback) {
          try {
            const geo = await tryFetchGeoJSON(url);
            divisionGeoJsonRef.current = geo;
            allDivisionsLayerRef.current = L.geoJSON(geo, {
              style: { fillColor: 'transparent', weight: 2, opacity: 0.3, color: '#666', fillOpacity: 0 }
            }).addTo(map);
            divisionLoaded = true;
            break;
          } catch (err) {
            lastDivisionError = err as Error;
          }
        }
      }

      if (!districtLoaded) {
        for (const url of districtUrlsFallback) {
          try {
            const geo = await tryFetchGeoJSON(url);
            districtGeoJsonRef.current = geo;
            allDistrictsLayerRef.current = L.geoJSON(geo, {
              style: { fillColor: 'transparent', weight: 1, opacity: 0.2, color: '#999', fillOpacity: 0 }
            }).addTo(map);
            districtLoaded = true;
            break;
          } catch (err) {
            lastDistrictError = err as Error;
          }
        }
      }

      if (!divisionLoaded || !districtLoaded) {
        const divisionsFc = {
          type: 'FeatureCollection',
          features: DIVISIONS.map(d => {
            const center = DIVISION_CENTROIDS[d.name] ?? defaultCenter;
            return makeSquareFeature(d.name, center, 55);
          })
        };
        const districtsFc = {
          type: 'FeatureCollection',
          features: DISTRICTS.map(dist => {
            const center = DIVISION_CENTROIDS[dist.division] ?? defaultCenter;
            return makeSquareFeature(dist.name, center, 18);
          })
        };
        divisionGeoJsonRef.current = divisionsFc;
        districtGeoJsonRef.current = districtsFc;
        allDivisionsLayerRef.current = L.geoJSON(divisionsFc, {
          style: { fillColor: 'transparent', weight: 2, opacity: 0.25, color: '#666', fillOpacity: 0 }
        }).addTo(map);
        allDistrictsLayerRef.current = L.geoJSON(districtsFc, {
          style: { fillColor: 'transparent', weight: 1, opacity: 0.18, color: '#999', fillOpacity: 0 }
        }).addTo(map);
        setUseFallbackCentroids(false);
        setLoadError(
          `Could not load precise GeoJSON. Division: ${lastDivisionError?.message ?? 'failed'} | District: ${lastDistrictError?.message ?? 'failed'}. Using generated approximations.`
        );
      } else {
        setLoadError('');
      }

      setGeoJsonLoaded(true);

      requestAnimationFrame(() => { try { map.invalidateSize(); } catch {} });

      mapRef.current = map;
      mapInitializedRef.current = true;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      mapInitializedRef.current = false;
      setMapReady(false);
    };
  }, [isClient]);

  // reset helpers
  const resetDivisionStyles = () => {
    try {
      allDivisionsLayerRef.current?.eachLayer((ly: any) => {
        try {
          ly.setStyle?.({
            fillColor: 'transparent',
            color: '#666',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0
          });
        } catch {}
      });
    } catch {}
    try {
      divisionLayerRef.current?.remove?.();
    } catch {}
    divisionLayerRef.current = null;
  };

  const resetDistrictStyles = () => {
    try {
      allDistrictsLayerRef.current?.eachLayer((ly: any) => {
        try {
          ly.setStyle?.({
            fillColor: 'transparent',
            color: '#999',
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0
          });
        } catch {}
      });
    } catch {}
    try {
      districtLayerRef.current?.remove?.();
    } catch {}
    districtLayerRef.current = null;
  };

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;

    resetDivisionStyles();
    if (!selectedDivision) return;

    const division = DIVISIONS.find(d => d.name === selectedDivision);
    if (!division) return;

    if (useFallbackCentroids) {
      const center = DIVISION_CENTROIDS[selectedDivision] ?? defaultCenter;
      const radius = 70000;
      const circle = L.circle(center as any, {
        color: division.color,
        weight: 3,
        fillColor: division.color,
        fillOpacity: 0.25,
        radius
      }).addTo(map);
      divisionLayerRef.current = L.layerGroup([circle]);
      map.setView(center as any, 7.6, { animate: true });
      return;
    }

    if (!geoJsonLoaded || !divisionGeoJsonRef.current || !allDivisionsLayerRef.current) return;

    try {
      const matchedLayers: any[] = [];
      const bounds = (L as any).latLngBounds([]);

      allDivisionsLayerRef.current.eachLayer((ly: any) => {
        const f = ly.feature || {};
        const p = f.properties || {};
        const names = [p.name, p.NAME, p.NAME_1, p.ADM1_EN, p.division].filter(Boolean).map(String);
        const match = names.some(n => n.toLowerCase().includes(selectedDivision.toLowerCase()));
        if (match) {
          try {
            ly.setStyle({
              fillColor: division.color,
              color: division.color,
              weight: 3,
              opacity: 1,
              fillOpacity: 0.35
            });
            ly.bringToFront?.();
            matchedLayers.push(ly);
            if (ly.getBounds) bounds.extend(ly.getBounds());
          } catch {}
        } else {
          try {
            ly.setStyle({
              fillColor: 'transparent',
              color: '#666',
              weight: 1,
              opacity: 0.6,
              fillOpacity: 0
            });
          } catch {}
        }
      });

      divisionLayerRef.current = L.layerGroup(matchedLayers);
      if (bounds.isValid()) {
        const size = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
        if (size < 400000) map.fitBounds(bounds.pad(0.05), { animate: true });
        else map.fitBounds(bounds, { animate: true });
      }
    } catch (err) {
      console.error('Error highlighting division:', err);
    }
  }, [selectedDivision, mapReady, geoJsonLoaded, useFallbackCentroids]);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;

    resetDistrictStyles();
    if (!selectedDistrict) return;

    const district = DISTRICTS.find(d => d.name === selectedDistrict);
    if (!district) return;

    if (useFallbackCentroids) {
      const center = DIVISION_CENTROIDS[district.division] ?? defaultCenter;
      const radius = 22000;
      const circle = L.circle(center as any, {
        color: district.color,
        weight: 3,
        fillColor: district.color,
        fillOpacity: 0.35,
        radius
      }).addTo(map);
      districtLayerRef.current = L.layerGroup([circle]);
      map.setView(center as any, 9.4, { animate: true });
      return;
    }

    if (!geoJsonLoaded || !districtGeoJsonRef.current || !allDistrictsLayerRef.current) return;

    try {
      const matched: any[] = [];
      const bounds = (L as any).latLngBounds([]);

      allDistrictsLayerRef.current.eachLayer((ly: any) => {
        const f = ly.feature || {};
        const p = f.properties || {};
        const names = [p.name, p.NAME, p.NAME_2, p.ADM2_EN, p.district].filter(Boolean).map(String);
        const match = names.some(n => n.toLowerCase().includes(selectedDistrict.toLowerCase()));
        if (match) {
          try {
            ly.setStyle({
              fillColor: district.color,
              color: district.color,
              weight: 2,
              opacity: 1,
              fillOpacity: 0.45
            });
            ly.bringToFront?.();
            matched.push(ly);
            if (ly.getBounds) bounds.extend(ly.getBounds());
          } catch {}
        } else {
          try {
            ly.setStyle({
              fillColor: 'transparent',
              color: '#999',
              weight: 1,
              opacity: 0.6,
              fillOpacity: 0
            });
          } catch {}
        }
      });

      districtLayerRef.current = L.layerGroup(matched);
      if (bounds.isValid()) {
        const size = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
        if (size < 400000) map.fitBounds(bounds.pad(0.05), { animate: true });
        else map.fitBounds(bounds, { animate: true });
      }
    } catch (err) {
      console.error('Error highlighting district:', err);
    }
  }, [selectedDistrict, mapReady, geoJsonLoaded, useFallbackCentroids]);

  const clearBoundaries = () => {
    resetDivisionStyles();
    resetDistrictStyles();
    setSelectedDivision('');
    setSelectedDistrict('');
    if (mapRef.current) mapRef.current.setView(defaultCenter, defaultZoom, { animate: true });
  };

  const centerDhaka = () => {
    if (mapRef.current) mapRef.current.setView(defaultCenter, 13, { animate: true });
  };

  useEffect(() => {
    return () => {
      try { divisionLayerRef.current?.remove?.(); } catch {}
      try { districtLayerRef.current?.remove?.(); } catch {}
      try { allDivisionsLayerRef.current?.remove?.(); } catch {}
      try { allDistrictsLayerRef.current?.remove?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    const handler = () => { try { mapRef.current?.invalidateSize(); } catch {} };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => { setSelectedDivision(e.target.value); setSelectedDistrict(''); }}
              className="min-w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((div) => <option key={div.name} value={div.name}>{div.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="min-w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedDivision && filteredDistricts.length === DISTRICTS.length}
            >
              <option value="">Select District</option>
              {filteredDistricts.map((dist) => <option key={dist.name} value={dist.name}>{dist.name}</option>)}
            </select>
          </div>

          {(selectedDivision || selectedDistrict) && (
            <button onClick={clearBoundaries} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-600 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors">
              <X className="h-4 w-4" /> Clear Selection
            </button>
          )}

          <button onClick={centerDhaka} className="mt-5 ml-auto inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors">
            <MapPin className="h-4 w-4" /> Center Dhaka
          </button>
        </div>

        {(selectedDivision || selectedDistrict) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <div className="font-semibold text-blue-900">Selected:</div>
              {selectedDistrict && <div className="text-blue-700">{selectedDistrict} District, {DISTRICTS.find(d => d.name === selectedDistrict)?.division} Division</div>}
              {selectedDivision && !selectedDistrict && <div className="text-blue-700">{selectedDivision} Division</div>}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0" />
        {!geoJsonLoaded && !loadError && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 z-[1000]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Loading boundaries...</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}