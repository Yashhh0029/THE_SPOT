/**
 * The Spot - Pune Geolocation & Radar Calculation Utilities
 * Truth-in-data: Explicitly labels mock/simulated coordinates in development
 */

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

// Known Pune neighborhood geographic centers
export const PUNE_NEIGHBORHOOD_COORDS: Record<string, GeoCoordinate> = {
  'Koregaon Park': { latitude: 18.5362, longitude: 73.8940 },
  'Kalyani Nagar': { latitude: 18.5484, longitude: 73.9034 },
  'Viman Nagar': { latitude: 18.5679, longitude: 73.9143 },
  'Baner': { latitude: 18.5590, longitude: 73.7868 },
  'FC Road': { latitude: 18.5204, longitude: 73.8415 },
  'Hinjewadi': { latitude: 18.5913, longitude: 73.7389 },
  'Aundh': { latitude: 18.5580, longitude: 73.8075 },
  'Kothrud': { latitude: 18.5074, longitude: 73.8077 },
};

/**
 * Calculates genuine spherical distance in kilometers between two coordinates
 * using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(1));
}

/**
 * Calculates bearing angle (0 - 360 degrees) from source to destination
 */
export function calculateBearingAngleDeg(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const y = Math.sin((coord2.longitude - coord1.longitude) * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180);
  const x =
    Math.cos(coord1.latitude * Math.PI / 180) * Math.sin(coord2.latitude * Math.PI / 180) -
    Math.sin(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * Math.cos((coord2.longitude - coord1.longitude) * Math.PI / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Privacy protection helper:
 * Obfuscates private addresses if the user does NOT have a confirmed ticket
 */
export function getSafeDisplayLocation(
  locationArea: string,
  venueName: string,
  isPrivateAddress: boolean,
  isConfirmed: boolean
): { venueText: string; isProtected: boolean } {
  if (isPrivateAddress && !isConfirmed) {
    return {
      venueText: `Secret Location (${locationArea}) · Revealed upon RSVP`,
      isProtected: true,
    };
  }
  return {
    venueText: `${venueName}, ${locationArea}`,
    isProtected: false,
  };
}
