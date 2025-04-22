import React, { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    LayersControl,
} from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import L from "leaflet";
import { useLocationPicker } from "@/hooks/useLocationPicker";
import { toast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface ReportFormValues {
    address: string;
    latitude?: number;
    longitude?: number;
}

interface LocationPickerProps {
    form: UseFormReturn<ReportFormValues>;
    onLocationChange?: (location: { lat?: number; lng?: number; address?: string }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ form, onLocationChange }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const { location, isLocating, inputHighlight, handleGetCurrentLocation } = useLocationPicker(
        mapRef,
        markerRef,
        form
    );

    useEffect(() => {
        if (location.lat && location.lng && location.address && onLocationChange) {
            onLocationChange({
                lat: location.lat,
                lng: location.lng,
                address: location.address,
            });
            form.setValue("latitude", location.lat, { shouldValidate: true });
            form.setValue("longitude", location.lng, { shouldValidate: true });
        }
    }, [location, form, onLocationChange]);

    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                    );
                    const data = await res.json();
                    const address = data.display_name || "Unknown location";
                    form.setValue("address", address, { shouldValidate: true });
                    form.setValue("latitude", lat, { shouldValidate: true });
                    form.setValue("longitude", lng, { shouldValidate: true });
                    if (onLocationChange) {
                        onLocationChange({ lat, lng, address });
                    }
                    if (mapRef.current) {
                        mapRef.current.setView([lat, lng], 16);
                    }
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                        markerRef.current.bindPopup(address).openPopup();
                    }
                } catch (err) {
                    console.error("Reverse geocoding failed:", err);
                    toast({
                        title: "Error",
                        description: "Failed to fetch address from coordinates.",
                        variant: "destructive",
                    });
                }
            },
        });
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    id="address"
                    {...form.register("address")}
                    value={form.watch("address") || ""}
                    onChange={(e) => {
                        form.setValue("address", e.target.value, { shouldValidate: true });
                        if (onLocationChange) {
                            onLocationChange({ ...location, address: e.target.value });
                        }
                    }}
                    placeholder="Enter address or use current location"
                    className={`transition-all duration-300 ${
                        inputHighlight ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    aria-label="Get current location"
                >
                    {isLocating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MapPin className="h-4 w-4" />
                    )}
                </Button>
            </div>
            {form.formState.errors.address && (
                <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
            )}
            <div className="h-[400px] w-full">
                <MapContainer
                    center={[20.5937, 78.9629]} // Default center (India)
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef}
                >
                    <LayersControl position="topright" aria-label="Map layer selector">
                        <LayersControl.BaseLayer checked name="Street Map">
                            <TileLayer
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Satellite">
                            <ReactLeafletGoogleLayer
                                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                                type="satellite"
                                attribution='© <a href="https://www.google.com/maps">Google Maps</a>'
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    {location.lat && location.lng && (
                        <Marker position={[location.lat, location.lng]} ref={markerRef}>
                            <Popup>{location.address || "Selected location"}</Popup>
                        </Marker>
                    )}
                    <MapEvents />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationPicker;