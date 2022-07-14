// Import the leaflet package

var L = require('leaflet');

const maps = document.getElementById('map')
const daysCounter = document.querySelector('.date-counter');
const latlngs = document.querySelectorAll('.routing');
const names = document.querySelectorAll('.route__name');
const routeDescription = document.querySelectorAll('.routeDescription');
const routeDescriptionParentEl = document.querySelector('.destinations__map-content')
const spinner = document.querySelector('.spinner__container');
const parentEl = document.querySelector('.map__tabs')
let routeCoords = [];
let locations = [];
const routes = [];


console.log('routeparentEl:', routeDescriptionParentEl);

const grayMarker = L.icon({
    iconUrl: '/img/bitmapa6.png',
    iconSize: [40, 60], // size of the icon
    iconAnchor: [20, 60], // point of the icon which will correspond to marker's location

});
const greenMarker = L.icon({
    iconUrl: '/img/bitmapa4.png',
    iconSize: [40, 60], // size of the icon
    iconAnchor: [20, 60], // point of the icon which will correspond to marker's location

});


var lineLayer;
let markerGroup;

const popupEventListener = function () {
    const searchLink = document.querySelector('.search__link');

}


const createStartEndPoints = (coords) => {
    const startPoint = coords[0];

    const endPoint = coords[coords.length - 1];
    const routeStartCoords = ['Start', startPoint[0], startPoint[1]]
    const routeEndCoords = ['Koniec', endPoint[0], endPoint[1]]
    routeCoords = [
        routeStartCoords,
        routeEndCoords
    ];
    // console.log(routeCoords, routeCoords.length, routeCoords[0].length);

}


const createMarkers = (locations) => {
    markerGroup = L.layerGroup().addTo(map)

    for (var i = 0; i < locations.length; i++) {
        marker = new L.marker([locations[i][1], locations[i][2]], {
                icon: grayMarker
            })
            .bindPopup(locations[i][0])
            .addTo(markerGroup);
    }
}
// Pushing arrays of each route into routes array

const createRoutes = () => {
    let data = []
    names.forEach((name, i) => {
        data.push(name.value)
        data.push(latlngs[i].value)
        routes.push(data)
        data = []
        parentEl.insertAdjacentHTML('afterbegin', `<div class="map__tab-container"><button class="map__tab" dataRoute="${i}">${name.value}</button></div>`)
    })

}

const createDescription = (index = routes.length - 1) => {
    // console.log(routeDescription[index]);
    let data = routeDescription[index].value;
    routeDescriptionParentEl.textContent = '';
    routeDescriptionParentEl.insertAdjacentHTML('afterbegin', `<p>${data}</p>`)
}






// Rendering polyLine on map
const renderRoute = (latlngsConv) => {

    var polyline = L.polyline(latlngsConv, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(map)
    lineLayer = L.layerGroup([polyline]).addTo(map)
    map.fitBounds(polyline.getBounds());
    createStartEndPoints(latlngsConv);
    console.log('routeCoords', routeCoords);
    createMarkers(routeCoords);
    routeCoords = '';



}


createRoutes()







// Converting data for first route rendereing
// Adding active class to first tab
const tabs = document.querySelectorAll('.map__tab')
let latlngsConv = routes.length !== 0 ? JSON.parse(routes[(routes.length * 1 - 1)][1]) : '';
const activeTab = routes.length !== 0 ? document.querySelector(`[dataRoute="${(routes.length - 1)}"]`).classList.add('active') : ''
if (latlngsConv !== '') {
    latlngsConv.forEach((point, i) => point.reverse())
}
const switchActive = () => {
    tabs.forEach(tab => tab.classList.remove('active'));

}




console.log(tabs.length);
// Render route after click
if (tabs.length > 0) {
    createDescription()
}
tabs.forEach(tab => tab.addEventListener('click', function (e) {
    map.removeLayer(lineLayer);
    map.removeLayer(markerGroup);



    let index = tab.getAttribute('dataRoute');
    console.log(index);
    let latlngs = JSON.parse(routes[index][1]);
    latlngs.forEach((point, i) => point.reverse());
    latlngsConv = latlngs;
    renderRoute(latlngsConv);
    switchActive();
    createDescription(index);
    e.target.classList.add('active');



}))







// Get pins from API
const getPins = async function () {
    let res = await fetch('/map/pins');
    // console.log(res);
    res.status === 200 ? spinner.style.display = 'none' : spinner.style.display = 'flex';
    let data = await res.json();
    // console.log(data);
    let pinData = [];
    await data.forEach(pin => {
        pinData.push(`<a class="search__link" href="/search/?searchTerm=${pin.pinLink}">${pin.pinLocation}</a>`);
        // pinData.push(pin.pinLocation);
        pinData.push(pin.pinLatitude);
        pinData.push(pin.pinLongitude);
        locations.push(pinData);
        pinData = []

    })
    // console.log('locations:', locations);

    createMarkers(locations, grayMarker);
    // Add event listener on markers
    const markers = document.querySelectorAll('.leaflet-marker-icon')
    markers.forEach(marker => marker.addEventListener('click', function () {
        // console.log('marker kliknięty');
    }))

}



// Leaflet
// map ------------------
let resBody;
if (maps) {

    var map = L.map('map', {


        dragging: window.innerWidth < 1024 ? false : true,
        tap: window.innerWidth < 1024 ? false : true,

        inertia: false,
        scrollWheelZoom: window.innerWidth < 1024 ? false : true,

    }).setView([10.01, -84.221388888889], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemFiaWVnbGkiLCJhIjoiY2t0eGE5NjhkMTJsczMwbXhkb2N0Y2UxZCJ9.9LFCbpbXL3o5trk3NM7WRw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token',
        // waypoints: route.way_points
    }).addTo(map);


    if (!daysCounter) {
        getPins()


    }

    if (daysCounter) {
        renderRoute(latlngsConv);
        // createMarkers(routeCoords)


    }








}