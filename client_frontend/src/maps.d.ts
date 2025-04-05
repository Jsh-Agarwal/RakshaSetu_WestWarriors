/// <reference types="@types/google.maps" />

declare global {
    interface Window {
      google: typeof google;
    }
  }
  
  export interface CrimeMapProps {
    className?: string;
    currentLocation?: string;
    center?: {
      lat: number;
      lng: number;
    };
  }
  
  export interface CrimePoint {
    id: number;
    lat: number;
    lng: number;
    type: string;
    severity: 'high' | 'medium' | 'low';
  }