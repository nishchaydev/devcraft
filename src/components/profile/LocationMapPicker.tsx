import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';
import { DeliveryLocation } from '../../types/app';

const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY || 'sacyvcuvnfoserpaeskzncmwobmkoapneeyu';

// Fix Leaflet marker icon image path issue
const pinIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background-color: #4f46e5; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; items-center; justify-center;">
          <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg); margin: auto;"></div>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface LocationMapPickerProps {
  onLocationSelect: (location: DeliveryLocation) => void;
  initialLocation?: DeliveryLocation | null;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>(
    typeof initialLocation === 'string'
      ? initialLocation
      : initialLocation?.address || 'Click map or drag pin to select location'
  );

  const defaultLat = initialLocation && typeof initialLocation !== 'string' && initialLocation.latitude ? initialLocation.latitude : 28.6139;
  const defaultLng = initialLocation && typeof initialLocation !== 'string' && initialLocation.longitude ? initialLocation.longitude : 77.2090;

  // Perform reverse geocoding via Mappls API with Nominatim OSM fallback
  const performReverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    let addressStr = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    let city = '';
    let pincode = '';

    try {
      // Try Mappls API reverse geocode
      const res = await fetch(`https://apis.mappls.com/advancedmaps/v1/${MAPPLS_KEY}/rev_geocode?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results?.[0]?.formatted_address) {
          addressStr = data.results[0].formatted_address;
          city = data.results[0].city || '';
          pincode = data.results[0].pincode || '';
        } else {
          throw new Error('Mappls returned empty address');
        }
      } else {
        throw new Error('Mappls API HTTP error');
      }
    } catch (err) {
      // Fallback to OpenStreetMap Nominatim
      try {
        const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (osmRes.ok) {
          const osmData = await osmRes.json();
          if (osmData.display_name) {
            addressStr = osmData.display_name;
            city = osmData.address?.city || osmData.address?.town || osmData.address?.state_district || '';
            pincode = osmData.address?.postcode || '';
          }
        }
      } catch (osmErr) {
        console.warn('OSM Reverse Geocode fallback error:', osmErr);
      }
    } finally {
      setIsGeocoding(false);
      setCurrentAddress(addressStr);
      onLocationSelect({
        address: addressStr,
        latitude: lat,
        longitude: lng,
        city,
        pincode,
      });
    }
  };

  // Move marker & map view to lat/lng
  const updateMapPosition = (lat: number, lng: number, updateReverse = true) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (updateReverse) {
      performReverseGeocode(lat, lng);
    }
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    // Marker drag handler
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      performReverseGeocode(pos.lat, pos.lng);
    });

    // Map click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      performReverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Search input with Mappls / OSM suggestions
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Try Mappls geocode search
      const res = await fetch(`https://apis.mappls.com/advancedmaps/v1/${MAPPLS_KEY}/geo_code?address=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.copResults && data.copResults.length > 0) {
          setSearchResults(data.copResults.map((r: any) => ({
            displayName: r.formattedAddress || r.placeName,
            lat: parseFloat(r.latitude),
            lng: parseFloat(r.longitude),
          })));
          setIsSearching(false);
          return;
        }
      }
    } catch (e) {
      // Fallback
    }

    // Fallback to OpenStreetMap Nominatim
    try {
      const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        setSearchResults(osmData.map((r: any) => ({
          displayName: r.display_name,
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        })));
      }
    } catch (err) {
      console.warn('Search geocode error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Geolocation "Locate Me" button
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      setIsGeocoding(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateMapPosition(latitude, longitude, true);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setIsGeocoding(false);
          alert('Could not access your location. Please select on the map manually.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Bar with Autocomplete */}
      <div className="relative">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7b7b78] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search city, area, or pincode..."
            className="w-full bg-[#faf8f5] border border-[#d3cec6] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#111111] placeholder-[#7b7b78] focus:outline-none focus:border-[#111111]"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-[#ff5600] absolute right-3 top-3 animate-spin" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-[1000] left-0 right-0 top-12 bg-white border border-[#d3cec6] rounded-xl shadow-md overflow-hidden max-h-48 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  updateMapPosition(result.lat, result.lng, true);
                  setSearchResults([]);
                  setSearchQuery(result.displayName);
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#111111] hover:bg-[#faf8f5] border-b border-[#e5e0d8] last:border-0 truncate"
              >
                {result.displayName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Viewport Container */}
      <div className="relative rounded-xl overflow-hidden border border-[#d3cec6] shadow-sm h-64 w-full">
        <div ref={mapContainerRef} className="w-full h-full bg-[#faf8f5]" />

        {/* Floating "Locate Me" Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="absolute bottom-3 right-3 z-[400] ic-btn-primary p-2.5 rounded-lg flex items-center gap-1.5 text-xs transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Address Card Display */}
      <div className="bg-[#faf8f5] border border-[#d3cec6] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#626260]">
        <MapPin className="w-4 h-4 text-[#ff5600] shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-[#111111]">Delivery Address:</span>
          {isGeocoding ? (
            <div className="flex items-center gap-2 mt-1 text-[#ff5600]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching street address...</span>
            </div>
          ) : (
            <p className="text-[#626260] mt-0.5 leading-relaxed">{currentAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};
