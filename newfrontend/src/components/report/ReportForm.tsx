import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, Camera, Paperclip, Mic, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { reportService } from '@/services/api';
import VoiceReportingButton from './VoiceReportingButton';
import { useAuth } from '@/contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useLocationPicker } from '@/hooks/useLocationPicker';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const incidentTypes = [
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'vandalism', label: 'Vandalism' },
    { value: 'suspicious', label: 'Suspicious Activity' },
    { value: 'noise', label: 'Noise Complaint' },
    { value: 'traffic', label: 'Traffic Incident' },
    { value: 'other', label: 'Other' },
];

// Define reportSchema and ReportFormValues first
const reportSchema = z.object({
    incidentType: z.string().min(1, { message: 'Incident type is required' }),
    date: z.string().min(1, { message: 'Date is required' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
    contact: z.string().email({ message: 'Invalid email address' }).optional(),
    address: z.string().min(3, { message: 'Location/address is required' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
type ReportFormValues = z.infer<typeof reportSchema>;

const LocationPicker = ({
                            form,
                            onLocationChange,
                        }: {
    form: UseFormReturn<ReportFormValues>;
    onLocationChange: (location: { lat?: number; lng?: number; address?: string }) => void;
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const { location, isLocating, inputHighlight, handleGetCurrentLocation } = useLocationPicker(mapRef, markerRef, form);

    React.useEffect(() => {
        if (location.lat && location.lng && location.address) {
            onLocationChange({
                lat: location.lat,
                lng: location.lng,
                address: location.address,
            });
            form.setValue('latitude', location.lat);
            form.setValue('longitude', location.lng);
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
                    const address = data.display_name || 'Unknown location';
                    form.setValue('address', address);
                    form.setValue('latitude', lat);
                    form.setValue('longitude', lng);
                    onLocationChange({ lat, lng, address });
                    if (mapRef.current) {
                        mapRef.current.setView([lat, lng], 16);
                    }
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                        markerRef.current.bindPopup(address).openPopup();
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                }
            },
        });
        return null;
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    id="address"
                    {...form.register('address')}
                    value={form.watch('address') || ''}
                    onChange={(e) => {
                        form.setValue('address', e.target.value);
                        onLocationChange({ ...location, address: e.target.value });
                    }}
                    placeholder="Enter address or use current location"
                    className={`transition-all duration-300 ${
                        inputHighlight ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={handleGetCurrentLocation}
                                className="absolute right-3 top-2.5 text-muted-foreground"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: isLocating ? 'not-allowed' : 'pointer',
                                    pointerEvents: isLocating ? 'none' : 'auto',
                                }}
                                tabIndex={-1}
                                disabled={isLocating}
                            >
                                {isLocating ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <MapPin className="w-5 h-5" />
                                )}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Use my current location</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <span className="text-red-500 text-xs">{form.formState.errors.address?.message}</span>
            <p className="text-sm text-muted-foreground mb-2">Or click to add location on map</p>
            <div className="h-64 w-full border rounded-md overflow-hidden">
                <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {location.lat && location.lng && (
                        <Marker position={[location.lat, location.lng]} ref={markerRef}>
                            <Popup>{location.address}</Popup>
                        </Marker>
                    )}
                    <MapEvents />
                </MapContainer>
            </div>
        </div>
    );
};

const ReportForm = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [hasEvidence, setHasEvidence] = useState(false);
    const [reportType, setReportType] = useState<'text' | 'voice'>('text');
    const [location, setLocation] = useState<{ lat?: number; lng?: number; address?: string }>({});
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            incidentType: '',
            date: '',
            description: '',
            name: user?.name || '',
            contact: user?.email || '',
            address: '',
        },
    });

    const handleLocationChange = (newLocation: { lat?: number; lng?: number; address?: string }) => {
        setLocation(newLocation);
    };

    const handleVoiceRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
        toast({
            title: 'Voice Recording Complete',
            description: 'Your voice recording has been saved. Please submit your report.',
        });
    };

    const onSubmit = async (values: ReportFormValues) => {
        setIsSubmitting(true);
        try {
            const reportData = {
                incidentType: values.incidentType,
                date: values.date,
                description: values.description,
                location: values.address,
                latitude: location.lat,
                longitude: location.lng,
                anonymous: isAnonymous,
                reportedBy: isAnonymous ? 'anonymous' : user?.email ?? '',
                reporter: isAnonymous
                    ? null
                    : {
                        name: values.name,
                        contact: values.contact,
                    },
            };
            await reportService.createReport(reportData);
            toast({
                title: 'Report Submitted',
                description: 'Thank you for your report. An officer will review it shortly.',
            });
            form.reset();
            setLocation({});
            setAudioBlob(null);
            setHasEvidence(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            toast({
                title: 'Submission Failed',
                description: 'There was an error submitting your report. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVoiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const reportData = {
                location: location.address,
                coordinates: location.lat && location.lng ? { lat: location.lat, lng: location.lng } : undefined,
                anonymous: isAnonymous,
            };
            if (!audioBlob) throw new Error('No audio recorded');
            await reportService.createReport(reportData);
            toast({
                title: 'Voice Report Submitted',
                description: 'Thank you for your report. An officer will review it shortly.',
            });
            form.reset();
            setLocation({});
            setAudioBlob(null);
        } catch (error) {
            console.error('Error submitting voice report:', error);
            toast({
                title: 'Submission Failed',
                description: 'There was an error submitting your voice report. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-police-600" />
                    Report an Incident
                </CardTitle>
                <CardDescription>
                    Provide details about the incident you'd like to report. All information will be kept confidential.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="text" onValueChange={(value) => setReportType(value as 'text' | 'voice')}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="text">Written Report</TabsTrigger>
                        <TabsTrigger value="voice">
                            <Mic className="mr-2 h-4 w-4" />
                            Voice Report
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="incidentType">Type of Incident</Label>
                                    <Select
                                        value={form.watch('incidentType')}
                                        onValueChange={(value) => form.setValue('incidentType', value)}
                                    >
                                        <SelectTrigger id="incidentType">
                                            <SelectValue placeholder="Select incident type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {incidentTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-red-500 text-xs">{form.formState.errors.incidentType?.message}</span>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date & Time of Incident</Label>
                                    <Input id="date" type="datetime-local" {...form.register('date')} />
                                    <span className="text-red-500 text-xs">{form.formState.errors.date?.message}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Location</Label>
                                <LocationPicker form={form} onLocationChange={handleLocationChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    {...form.register('description')}
                                    rows={4}
                                    className="min-h-[120px]"
                                />
                                <span className="text-red-500 text-xs">{form.formState.errors.description?.message}</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        disabled={isAnonymous}
                                        {...form.register('name')}
                                    />
                                    <span className="text-red-500 text-xs">{form.formState.errors.name?.message}</span>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact">
                                        Contact Information <span className="text-xs text-amber-700">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="contact"
                                        placeholder="Phone number or email (leave blank to remain anonymous)"
                                        disabled={isAnonymous}
                                        {...form.register('contact')}
                                    />
                                    <span className="text-xs text-amber-700">
        Leave blank to remain anonymous. Only provide if you want to be contacted for follow-up.
    </span>
                                    <span className="text-red-500 text-xs">{form.formState.errors.contact?.message}</span>
                                </div>                       </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                <Label htmlFor="anonymous">Report Anonymously</Label>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                <Switch id="evidence" checked={hasEvidence} onCheckedChange={setHasEvidence} />
                                <Label htmlFor="evidence">I have evidence to share</Label>
                        </div>
                        {hasEvidence && (
                            <div className="mt-4 space-y-4">
                                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className=" personally identifiable information to be collected or stored."></p>
                                        <p className="text-xs text-muted-foreground mb-4">Drag and drop files or click to browse</p>
                                        <Button type="button" variant="outline" size="sm">
                                            <Paperclip className="h-4 w-4 mr-2" />
                                            Choose Files
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="border p-4 rounded-md bg-muted/30 text-sm">
                        <p className="font-medium mb-2">Important Note:</p>
                        <p>
                            Filing a false police report is a crime. By submitting this form, you affirm that the
                            information provided is truthful to the best of your knowledge.
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-police-700 hover:bg-police-800"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="voice">
                <form onSubmit={handleVoiceSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Record Your Report</h3>
                        <p className="text-muted-foreground">
                            Speak clearly into your microphone to report the incident. Mention the type of incident,
                            location, date and time, and provide a detailed description.
                        </p>
                        <div className="border p-4 rounded-md">
                            {audioBlob ? (
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                                    </div>
                                    <Button
                                        onClick={() => setAudioBlob(null)}
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                    >
                                        Record Again
                                    </Button>
                                </div>
                            ) : (
                                <VoiceReportingButton onRecordingComplete={handleVoiceRecordingComplete} />
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address-voice">Location</Label>
                        <LocationPicker form={form} onLocationChange={handleLocationChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="anonymous-voice" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                        <Label htmlFor="anonymous-voice">Report Anonymously</Label>
                    </div>
                    <div className="border p-4 rounded-md bg-muted/30 text-sm">
                        <p className="font-medium mb-2">Important Note:</p>
                        <p>
                            Filing a false police report is a crime. By submitting this recording, you affirm that the
                            information provided is truthful to the best of your knowledge.
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !audioBlob}
                            className="bg-police-700 hover:bg-police-800"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            {isSubmitting ? 'Submitting...' : 'Submit Voice Report'}
                        </Button>
                    </div>
                </form>
            </TabsContent>
        </Tabs>
        </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
                All reports are processed securely and confidentially
            </CardFooter>
        </Card>
);
};

export default ReportForm;