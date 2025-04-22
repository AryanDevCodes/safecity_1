import React, { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import { UseFormReturn } from "react-hook-form";

interface Location {
    lat: number;
    lng: number;
    address: string;
}

interface ReportFormValues {
    address: string;
    latitude?: number;
    longitude?: number;
}

export function useLocationPicker(
    mapRef: React.MutableRefObject<L.Map | null>,
    markerRef?: React.MutableRefObject<L.Marker | null>,
    form?: UseFormReturn<ReportFormValues>
) {
    const [location, setLocation] = useState<Location>({
        lat: 0,
        lng: 0,
        address: "",
    });
    const [isLocating, setIsLocating] = useState(false);
    const [inputHighlight, setInputHighlight] = useState(false);

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleGetCurrentLocation = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            setIsLocating(true);

            try {
                const permissionStatus = await navigator.permissions.query({
                    name: "geolocation" as PermissionName,
                });

                if (permissionStatus.state === "denied") {
                    toast({
                        title: "Permission Denied",
                        description: "Location access is denied. Please enable it in browser settings.",
                        variant: "destructive",
                    });
                    setIsLocating(false);
                    return;
                }

                if (!navigator.geolocation) {
                    toast({
                        title: "Not Supported",
                        description: "Geolocation is not supported by your browser.",
                        variant: "destructive",
                    });
                    setIsLocating(false);
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                            );
                            const data = await res.json();

                            const address = data.display_name || "Unknown location";

                            setLocation({ lat, lng, address });
                            setInputHighlight(true);
                            setTimeout(() => setInputHighlight(false), 1000);

                            form?.setValue("address", address, { shouldValidate: true });

                            toast({
                                title: "Location Retrieved ✅",
                                description: address,
                                variant: "default",
                            });

                            if (mapRef.current) {
                                mapRef.current.setView([lat, lng], 16);
                            }

                            if (markerRef?.current) {
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
                        } finally {
                            setIsLocating(false);
                        }
                    },
                    (error: GeolocationPositionError) => {
                        console.error(`Geolocation error (code ${error.code}): ${error.message || "Unknown error"}`);
                        let description = "Unable to access your location.";
                        if (error.code === 1) {
                            description = "Location access denied. Please allow location permissions in your browser settings.";
                        } else if (error.code === 2) {
                            description =
                                "Location unavailable. Ensure location services are enabled on your device or enter an address manually.";
                        } else if (error.code === 3) {
                            description = "Location request timed out. Please try again.";
                        }
                        toast({
                            title: "Location Error",
                            description,
                            variant: "destructive",
                            action: (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => form?.setFocus("address")}
                                >
                                    Enter Address Manually
                                </Button>
                            ),
                        });
                        setIsLocating(false);
                    },
                    { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
                );
            } catch (err) {
                console.error("Permission check error:", err);
                toast({
                    title: "Unexpected Error",
                    description: "Something went wrong while checking location permissions.",
                    variant: "destructive",
                });
                setIsLocating(false);
            }
        }, 1000);
    };

    return {
        location,
        isLocating,
        inputHighlight,
        handleGetCurrentLocation,
    };
}