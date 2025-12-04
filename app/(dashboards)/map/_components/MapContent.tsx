'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';
import { MapPin, X } from 'lucide-react';

// Bangladesh Divisions with their names and colors
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

// Bangladesh Districts with their division mappings
const DISTRICTS = [
  // Dhaka Division
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
  
  // Chittagong Division
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
  
  // Rajshahi Division
  { name: 'Rajshahi', division: 'Rajshahi', color: '#13C2C2' },
  { name: 'Bogura', division: 'Rajshahi', color: '#52C41A' },
  { name: 'Pabna', division: 'Rajshahi', color: '#FA8C16' },
  { name: 'Sirajganj', division: 'Rajshahi', color: '#EB2F96' },
  { name: 'Natore', division: 'Rajshahi', color: '#722ED1' },
  { name: 'Naogaon', division: 'Rajshahi', color: '#2F54EB' },
  { name: 'Chapainawabganj', division: 'Rajshahi', color: '#FA541C' },
  { name: 'Joypurhat', division: 'Rajshahi', color: '#F759AB' },
  
  // Khulna Division
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
  
  // Barishal Division
  { name: 'Barishal', division: 'Barishal', color: '#EB2F96' },
  { name: 'Patuakhali', division: 'Barishal', color: '#C41D7F' },
  { name: 'Bhola', division: 'Barishal', color: '#FA541C' },
  { name: 'Pirojpur', division: 'Barishal', color: '#F759AB' },
  { name: 'Jhalokathi', division: 'Barishal', color: '#597EF7' },
  { name: 'Barguna', division: 'Barishal', color: '#9254DE' },
  
  // Sylhet Division
  { name: 'Sylhet', division: 'Sylhet', color: '#597EF7' },
  { name: 'Moulvibazar', division: 'Sylhet', color: '#2F54EB' },
  { name: 'Habiganj', division: 'Sylhet', color: '#722ED1' },
  { name: 'Sunamganj', division: 'Sylhet', color: '#9254DE' },
  
  // Rangpur Division
  { name: 'Rangpur', division: 'Rangpur', color: '#9254DE' },
  { name: 'Dinajpur', division: 'Rangpur', color: '#722ED1' },
  { name: 'Gaibandha', division: 'Rangpur', color: '#2F54EB' },
  { name: 'Kurigram', division: 'Rangpur', color: '#597EF7' },
  { name: 'Lalmonirhat', division: 'Rangpur', color: '#F759AB' },
  { name: 'Nilphamari', division: 'Rangpur', color: '#FA541C' },
  { name: 'Panchagarh', division: 'Rangpur', color: '#EB2F96' },
  { name: 'Thakurgaon', division: 'Rangpur', color: '#13C2C2' },
  
  // Mymensingh Division
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

  // approximate division centroids (lat, lng) for fallback when GeoJSON is unavailable
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

  // helper: generate a square polygon around a lat/lng center
  const makeSquareFeature = (name: string, center: [number, number], halfSizeKm: number) => {
    // approximate conversions
    const lat = center[0];
    const lon = center[1];
    const halfLatDeg = halfSizeKm / 111.0; // km -> degrees lat (approx)
    const halfLonDeg = halfSizeKm / (111.0 * Math.cos((lat * Math.PI) / 180)); // adjust by latitude
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

  // robust fetch + parse for GeoJSON (handles JSON, text with BOM, gists wrapped in text)
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

  // Initialize map and load GeoJSON (local public first, then CDN, then raw sources).
  // If all remote/local sources fail, generate a lightweight approximate GeoJSON
  // (squares around division centroids and smaller squares for districts) so the map remains usable
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

      // leaflet default icon fix
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

      // Try a variety of sources (local first)
      const divisionUrls = [
        '/bd-divisions.json', // public/
        '/geo/bd-divisions.json', // alternate public path
        'https://cdn.jsdelivr.net/gh/geodatanz/bangladesh-geojson@master/divisions.json',
        'https://cdn.jsdelivr.net/gh/mohosinmiah/BD-Geo-JSON@master/division.geojson',
        'https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/divisions.json',
        'https://raw.githubusercontent.com/mohosinmiah/BD-Geo-JSON/master/division.geojson',
        'https://gist.githubusercontent.com/lekhoni/4165017c47a9e63f4f81/raw/bangladesh-divisions.json'
      ];

      const districtUrls = [
        '/bd-districts.json', // public/
        '/geo/bd-districts.json',
        'https://cdn.jsdelivr.net/gh/geodatanz/bangladesh-geojson@master/districts.json',
        'https://cdn.jsdelivr.net/gh/mohosinmiah/BD-Geo-JSON@master/district.geojson',
        'https://raw.githubusercontent.com/geodatanz/bangladesh-geojson/master/districts.json',
        'https://raw.githubusercontent.com/mohosinmiah/BD-Geo-JSON/master/district.geojson',
        'https://gist.githubusercontent.com/lekhoni/4165017c47a9e63f4f81/raw/bangladesh-districts.json'
      ];

      const triedDivisionUrls: string[] = [];
      const triedDistrictUrls: string[] = [];

      let divisionLoaded = false;
      let lastDivisionError: Error | null = null;
      for (const url of divisionUrls) {
        triedDivisionUrls.push(url);
        try {
          const geo = await tryFetchGeoJSON(url);
          if (!geo) throw new Error('Empty division geojson');
          divisionGeoJsonRef.current = geo;
          allDivisionsLayerRef.current = L.geoJSON(geo, {
            style: {
              fillColor: 'transparent',
              weight: 2,
              opacity: 0.3,
              color: '#666',
              fillOpacity: 0
            }
          }).addTo(map);
          divisionLoaded = true;
          break;
        } catch (err) {
          lastDivisionError = err as Error;
          console.debug('Division load failed for', url, err);
        }
      }

      let districtLoaded = false;
      let lastDistrictError: Error | null = null;
      for (const url of districtUrls) {
        triedDistrictUrls.push(url);
        try {
          const geo = await tryFetchGeoJSON(url);
          if (!geo) throw new Error('Empty district geojson');
          districtGeoJsonRef.current = geo;
          allDistrictsLayerRef.current = L.geoJSON(geo, {
            style: {
              fillColor: 'transparent',
              weight: 1,
              opacity: 0.2,
              color: '#999',
              fillOpacity: 0
            }
          }).addTo(map);
          districtLoaded = true;
          break;
        } catch (err) {
          lastDistrictError = err as Error;
          console.debug('District load failed for', url, err);
        }
      }

      // If remote/local geojson not available, generate small approximate polygons
      if (!divisionLoaded || !districtLoaded) {
        // Build approx division polygon features (squares around centroids)
        const divisionsFc = {
          type: 'FeatureCollection',
          features: DIVISIONS.map(d => {
            const center = DIVISION_CENTROIDS[d.name] ?? defaultCenter;
            // divisions get ~55 km half-size (square ~110x110 km) - coarse but usable
            return makeSquareFeature(d.name, center, 55);
          })
        };

        // District squares: center on division centroid but much smaller (~18 km half-size)
        const districtsFc = {
          type: 'FeatureCollection',
          features: DISTRICTS.map(dist => {
            const center = DIVISION_CENTROIDS[dist.division] ?? defaultCenter;
            return makeSquareFeature(dist.name, center, 18);
          })
        };

        // use generated geojson so highlighting/filtering by name still works (feature.properties.name)
        divisionGeoJsonRef.current = divisionsFc;
        districtGeoJsonRef.current = districtsFc;

        // Add generated layers to map (transparent baseline)
        allDivisionsLayerRef.current = L.geoJSON(divisionsFc, {
          style: {
            fillColor: 'transparent',
            weight: 2,
            opacity: 0.25,
            color: '#666',
            fillOpacity: 0
          }
        }).addTo(map);

        allDistrictsLayerRef.current = L.geoJSON(districtsFc, {
          style: {
            fillColor: 'transparent',
            weight: 1,
            opacity: 0.18,
            color: '#999',
            fillOpacity: 0
          }
        }).addTo(map);

        setUseFallbackCentroids(false); // we have generated polygons so use polygon highlighting
        setGeoJsonLoaded(true);

        // Provide a note to the user but don't spam large error with attempted URLs
        setLoadError(
          'Precise remote GeoJSON not reachable. Using generated approximate boundaries so map remains interactive. Add bd-divisions.json & bd-districts.json to public/ for exact boundaries.'
        );
      } else {
        setGeoJsonLoaded(true);
      }

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

  // highlight division using loaded GeoJSON (natural borders) or centroid fallback
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;

    if (divisionLayerRef.current) {
      divisionLayerRef.current.remove();
      divisionLayerRef.current = null;
    }

    if (!selectedDivision) return;

    const division = DIVISIONS.find(d => d.name === selectedDivision);
    if (!division) return;

    // if we earlier failed to fetch geojson and set useFallbackCentroids true, circle fallback
    if (useFallbackCentroids) {
      const center = DIVISION_CENTROIDS[selectedDivision] ?? defaultCenter;
      const radius = 70000;
      const circle = L.circle(center as any, {
        color: division.color,
        weight: 2,
        fillColor: division.color,
        fillOpacity: 0.25,
        radius
      }).addTo(map);
      divisionLayerRef.current = circle;
      map.setView(center as any, 7.6, { animate: true });
      return;
    }

    // otherwise use whatever GeoJSON we have (remote, local or generated)
    if (!geoJsonLoaded || !divisionGeoJsonRef.current) return;

    try {
      const layer = L.geoJSON(divisionGeoJsonRef.current, {
        filter: (feature: any) => {
          const p = feature.properties || {};
          const names = [p.name, p.NAME, p.NAME_1, p.ADM1_EN, p.division].filter(Boolean);
          return names.some((n: string) => (n as string).toLowerCase().includes(selectedDivision.toLowerCase()));
        },
        style: () => ({
          fillColor: division.color,
          weight: 2,
          color: division.color,
          opacity: 1,
          fillOpacity: 0.25
        })
      }).addTo(map);

      divisionLayerRef.current = layer;

      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        const size = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
        if (size < 400000) map.fitBounds(bounds.pad(0.05), { animate: true });
      }
    } catch (err) {
      console.error('Error highlighting division:', err);
    }
  }, [selectedDivision, mapReady, geoJsonLoaded, useFallbackCentroids]);

  // highlight district using loaded GeoJSON or centroid fallback
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map) return;

    if (districtLayerRef.current) {
      districtLayerRef.current.remove();
      districtLayerRef.current = null;
    }

    if (!selectedDistrict) return;

    const district = DISTRICTS.find(d => d.name === selectedDistrict);
    if (!district) return;

    if (useFallbackCentroids) {
      const center = DIVISION_CENTROIDS[district.division] ?? defaultCenter;
      const radius = 22000;
      const circle = L.circle(center as any, {
        color: district.color,
        weight: 2,
        fillColor: district.color,
        fillOpacity: 0.35,
        radius
      }).addTo(map);
      districtLayerRef.current = circle;
      map.setView(center as any, 9.4, { animate: true });
      return;
    }

    if (!geoJsonLoaded || !districtGeoJsonRef.current) return;

    try {
      const layer = L.geoJSON(districtGeoJsonRef.current, {
        filter: (feature: any) => {
          const p = feature.properties || {};
          const names = [p.name, p.NAME, p.NAME_2, p.ADM2_EN, p.district].filter(Boolean);
          return names.some((n: string) => (n as string).toLowerCase().includes(selectedDistrict.toLowerCase()));
        },
        style: () => ({
          fillColor: district.color,
          weight: 2,
          color: district.color,
          opacity: 1,
          fillOpacity: 0.35
        })
      }).addTo(map);

      districtLayerRef.current = layer;

      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        const size = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
        if (size < 400000) map.fitBounds(bounds.pad(0.05), { animate: true });
      }
    } catch (err) {
      console.error('Error highlighting district:', err);
    }
  }, [selectedDistrict, mapReady, geoJsonLoaded, useFallbackCentroids]);

  const clearBoundaries = () => {
    if (divisionLayerRef.current) {
      divisionLayerRef.current.remove();
      divisionLayerRef.current = null;
    }
    if (districtLayerRef.current) {
      districtLayerRef.current.remove();
      districtLayerRef.current = null;
    }
    setSelectedDivision('');
    setSelectedDistrict('');
    if (mapRef.current) mapRef.current.setView(defaultCenter, defaultZoom, { animate: true });
  };

  const centerDhaka = () => {
    if (mapRef.current) mapRef.current.setView(defaultCenter, 13, { animate: true });
  };

  useEffect(() => {
    return () => {
      if (divisionLayerRef.current) divisionLayerRef.current.remove();
      if (districtLayerRef.current) districtLayerRef.current.remove();
      if (allDivisionsLayerRef.current) allDivisionsLayerRef.current.remove();
      if (allDistrictsLayerRef.current) allDistrictsLayerRef.current.remove();
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
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Bangladesh Map - Divisions & Districts</h1>
          <p className="text-sm text-gray-600 mt-1">Explore divisions and districts with actual administrative boundaries</p>
        </div>
      </div>

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

        {loadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{loadError}</p>
            <p className="mt-2 text-xs text-gray-600">
              To use exact boundaries, add bd-divisions.json & bd-districts.json to your project's public/ folder and reload.
            </p>
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

      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-3 border-2 border-gray-400" style={{ backgroundColor: 'rgba(100, 100, 100, 0.1)' }} />
            <span className="text-gray-600">Administrative Boundary</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-3 border-2 border-blue-500" style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
            <span className="text-gray-600">Highlighted Area</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Select a division or district to highlight its administrative area. For exact boundaries, place bd-divisions.json & bd-districts.json in public/.
          </p>
        </div>
      </div>
    </div>
  );
}