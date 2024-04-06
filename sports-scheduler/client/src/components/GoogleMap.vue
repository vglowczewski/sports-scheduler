<template>
  <div class="map-container">
    <h1>Event Location</h1>
    <div id="googleMap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const location = ref('');
const props = defineProps({
  eventLocation: String
});

// Load Google Maps script when the component is mounted
onMounted(() => {
  if (props.eventLocation) {
    location.value = props.eventLocation;
    loadGoogleMapsScript();
  }
});

// Method to load the Google Maps script
function loadGoogleMapsScript() {
  // Check if the Google Maps script is already loaded
  if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk&callback=initializeMap&libraries=places&loading=async`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  } else {
    // Google Maps script is already loaded, directly call initializeMap
    initializeMap();
  }
}

// Define the initializeMap function in the global scope
window.initializeMap = () => {
  let locationName = location.value;
  // Update locationName based on conditions
  if (locationName.toLowerCase() === 'school' || 
      locationName.toLowerCase() === 'prep school gym' || 
      locationName.toLowerCase() === 'upper school gym' || 
      locationName.toLowerCase() === 'turf') {
    locationName = 'Bayview Glen Independent School';
  }
  console.log(locationName)
  try {
    // Geocode the location name
    const response = geocodeLocation(locationName);
    response.then(data => {
      const { lat, lng } = data.results[0].geometry.location;
      const map = new window.google.maps.Map(document.getElementById("googleMap"), {
        center: { lat: lat, lng: lng },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      });
      new window.google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: locationName
      });
    }).catch(error => {
      console.error("Failed to load event location:", error);
    });
  } catch (error) {
    console.error("Failed to load event location:", error);
  }
}

// Method to geocode a location using Google Geocoding API
async function geocodeLocation(locationName) {
  console.log("here", locationName)
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: locationName,
      key: 'AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk'
    }
  });
  return response.data;
}
</script>

<style>
/* Add your CSS styles here */
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Set height to 100% of the viewport height */
}

#googleMap {
  width: 400px;
  height: 400px;
}
</style>