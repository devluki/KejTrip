// Import the leaflet package

var L = require('leaflet');
// var request = require('request');
const maps = document.getElementById('map')
const daysCounter = document.querySelector('.date-counter');
// const locations = [
//     // Mexico
//     ["Cancun", 21.161907, -86.851524],  [21.169679600743738, -86.85095246761496]
// ["San Jose", 9.909580, -84.054062],
//     ["Tulum", 20.104851, -87.478951], [20.248871672621824, -87.46677531683758]
//     ["Reserva de la Biósfera Sian Ka ", 19.225999, -87.471799], [19.851193078131796, -87.63935383146068]
//     ["Tizimin", 21.14284, -88.15119], [21.16847055608378, -88.14895486004643]
//     ["Las Coloradas", 30.0484789, -107.102204], [21.61295927619111, -87.99108670417193] //
// ["Merida", 20.583133, -89.37106], [21.070297942783775, -89.5952925420643] //
//     ["Campeche", 18.931225, -90.261807], [19.861155573671645, -90.53558259191773] ??
//     ["Xpujil", 18.5076, -89.39437], [18.529305772185527, -89.39301938320806] //
//     ["Calqkmul", 18.061941, -89.4838984], [19.03131853981946, -89.35580216729183]??
//     ["San Cristóbal de las Casas", 16.7317600, -92.6412600], [17.03353995134128, -92.66416649958616] ++
//     ["Comitan", 16.229960, -92.115569], [16.279146563206147, -92.11880981374945]
// [[21.169679600743738, -86.85095246761496],[20.248871672621824, -87.46677531683758],[19.851193078131796, -87.63935383146068],[21.16847055608378, -88.14895486004643],[19.861155573671645, -90.53558259191773],[18.529305772185527, -89.39301938320806],[19.03131853981946, -89.35580216729183],[17.03353995134128, -92.66416649958616],[16.279146563206147, -92.11880981374945],[-92.66416649958616,17.03353995134128]]
// [[21.161907, -86.851524],[20.207481,  -87.430496],[19.225999, -87.471799]]
// [[-86.851524, 21.161907], [-87.430496, 20.207481],[-87.68244253848052,19.843973998988915],
// [-88.15119,21.14284],[-87.99108670417193,21.61295927619111],[-89.5925857, 20.9673702], [-90.53483312210012,19.837711679907308],[-89.39353131309399,18.508844825585793],[-92.64213997919062,16.736812526633845],[-92.11880981374945,16.279146563206147]]

//     // Guatemala
//     ["La Mesilla", 15.6166642, -91.9833294],
//     ["Huehuetenango ", 15.308832098, -91.47233],
//     ["Quetzaltenango", 14.83333, -91.5166646],
//     ["Antigua", 14.5666644, -90.7333304],
//     ["San Juan La Laguna", 14.694589, -91.28333],
//     ["San Pedro La Laguna", 14.694, -91.272],
//     // Costarica
//     ["Manuel Antonio Park Narodowy", 9.371998512, -84.134832],
//     ["Quepos", 9.42357, -84.16522],
//     ["Santa Elena", 10.31426, -84.82502],
//     ["La Fortuna", 9.2333324, -83.583331],
//     ["Puerto Viejo de Sarapiqui", 10.453987, -84.019386],
//     ["Guápiles", 10.21682, -83.78483],
//     ["Tortuguero", 10.583331, -83.5166646],
//     ["Puerto Limón", 9.99074, -83.03596],
//     ["Cahuita", 9.7347856, -82.8452146],
//     ["Puerto Viejo de Talamanca", 9.6564943, -82.7535654],
// ]


const latlngs = document.querySelectorAll('.routing');
const names = document.querySelectorAll('.route__name');
const spinner = document.querySelector('.spinner__container');
let locations = [];
const parentEl = document.querySelector('.map__tabs')
const routes = [];


console.log('daysCounter', daysCounter);
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
createRoutes()

// Converting data for first route rendereing
// Adding active class to first tab
const tabs = document.querySelectorAll('.map__tab')
let latlngsConv = JSON.parse(routes[(routes.length * 1 - 1)][1]);
const activeTab = document.querySelector(`[dataRoute="${(routes.length - 1)}"]`).classList.add('active')
latlngsConv.forEach((point, i) => point.reverse())

const switchActive = (e) => {
    tabs.forEach(tab => tab.classList.remove('active'));

}





// Render route after click
tabs.forEach(tab => tab.addEventListener('click', function (e) {
    let index = tab.getAttribute('dataRoute');
    console.log(index);
    let latlngs = JSON.parse(routes[index][1]);
    latlngs.forEach((point, i) => point.reverse());
    latlngsConv = latlngs;
    renderRoute(latlngsConv);
    switchActive();
    e.target.classList.add('active');


}))



// Rendering polyLine on map
const renderRoute = (latlngsConv) => {

    var polyline = L.polyline(latlngsConv, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(map)
    var lineLayer = L.layerGroup([polyline]).addTo(map)
    map.fitBounds(polyline.getBounds());
    L.geoJSON(latlngsConv).addTo(map);
    // L.geoJSON(route.body).addTo(map);
}



// Get pins from API
const getPins = async function () {
    let res = await fetch('/map/pins');
    console.log(res);
    res.status === 200 ? spinner.style.display = 'none' : spinner.style.display = 'flex';
    let data = await res.json();
    console.log(data);
    let pinData = [];
    await data.forEach(pin => {
        pinData.push(pin.pinLocation);
        pinData.push(pin.pinLatitude);
        pinData.push(pin.pinLongitude);
        locations.push(pinData);
        pinData = []
        // console.log(pinData);
    })
    console.log(locations);
    for (var i = 0; i < locations.length; i++) {
        marker = new L.marker([locations[i][1], locations[i][2]], {
                icon: greenIcon
            })
            .bindPopup(locations[i][0])
            .addTo(map);
    }


}



// Leaflet
// map ------------------
let resBody;
if (maps) {

    var map = L.map('map', {

        dragging: window.innerWidth < 1024 ? false : true,
        tap: window.innerWidth < 1024 ? false : true,

        inertia: false,
        scrollWheelZoom: false,
    }).setView([10.01, -84.221388888889], 3);
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



    // Pin - icon
    var pinkIcon = L.icon({
        iconUrl: '../public/img/Pin2.png',
        iconSize: [40, 60],
        iconAnchor: [20, 60],
    });

    var greenIcon = L.icon({
        iconUrl: '/img/Pin.png',
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [40, 60], // size of the icon
        // shadowSize: [50, 64], // size of the shadow
        iconAnchor: [20, 60], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62], // the same for the shadow
        // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if (!daysCounter) {
        getPins()
    }

    if (daysCounter) {
        renderRoute(latlngsConv)
    }








}