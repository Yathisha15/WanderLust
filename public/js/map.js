mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90, remember one thing mapbox give opposite values of long and lat i.e if gmap give long and lat value it give lat and long value
    zoom: 9 // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)  //listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after Booking</p>`))
        .addTo(map);