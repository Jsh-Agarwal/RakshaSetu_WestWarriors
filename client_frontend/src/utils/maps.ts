export const GOOGLE_MAPS_API_KEY = 'AIzaSyDkLB2kml7k28-sZxjotxiNi5Q0I96I5-k';

export const defaultMapConfig: google.maps.MapOptions = {
  center: { lat: 20.5937, lng: 78.9629 }, // Center of India
  zoom: 5,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

export const mapOptions: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: 'in' },
  fields: ['formatted_address', 'geometry', 'name'],
  strictBounds: false,
};