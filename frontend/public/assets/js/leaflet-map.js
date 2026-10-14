function initLeafletMap(id, setupFn) {
    const el = document.getElementById(id);
    if (!el) return console.warn(`Map container #${id} not found.`);

    try {
        const map = L.map(el);
        setupFn(map);
    } catch (error) {
        console.error(`Error initializing map "${id}":`, error);
    }
}
// **------ Leaflet on Mobile Map **
initLeafletMap('mobileMap', (map) => {
    map.fitWorld();
    map.locate({ setView: true, maxZoom: 16 });

    const locationErrorHandler = () => map.setView([0, 0], 2);
    map.on('locationerror', locationErrorHandler);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
});

// **------ Accessible maps **
initLeafletMap('accessibleMap', (map) => {
    map.setView([50.4501, 30.5234], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([50.4501, 30.5234], { alt: 'Kyiv' })
        .addTo(map)
        .bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
});

// **------ Markers, Circles and Polygons **
initLeafletMap('markersMap', (map) => {
    map.setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    L.marker([51.5, -0.09])
        .addTo(map)
        .bindPopup("<b>Hello!</b><br>I am a popup.")
        .openPopup();

    L.circle([51.508, -0.10], {
        fillColor: '#467FFB',
        fillOpacity: 0.6,
        radius: 500
    }).addTo(map).bindPopup("This is circle.");

    L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ], {
        fillColor: '#467FFB',
        fillOpacity: 0.6
    }).addTo(map).bindPopup("This is polygon.");

    L.popup()
        .setLatLng([51.513, -0.09])
        .setContent("I am a standalone popup.")
        .openOn(map);
});

// **------ Interactive Choropleth Map **
initLeafletMap('interactiveMap', (map) => {
    map.setView([37.8, -96], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});

// **------ Markers With Custom Icons **
initLeafletMap('customIconsMap', (map) => {
    map.setView([51.5, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
            iconSize: [38, 95],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        }
    });

    const greenIcon = new LeafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png' });
    const redIcon = new LeafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png' });
    const orangeIcon = new LeafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png' });

    L.marker([51.5, -0.09], { icon: greenIcon }).addTo(map).bindPopup('I am a green.');
    L.marker([51.495, -0.083], { icon: redIcon }).addTo(map).bindPopup('I am a red.');
    L.marker([51.49, -0.1], { icon: orangeIcon }).addTo(map).bindPopup('I am an orange.');
});

// **------ Layer Groups and Layers Control **
initLeafletMap('layersMap', (map) => {
    map.setView([-29.50, 145], 3.5);
    map.scrollWheelZoom.disable();

    const baseMaps = {
        StreetView: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        Topography: L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi', {
            layers: 'BlueMarble_ShadedRelief_Bathymetry',
            format: 'image/png',
            transparent: false
        }),
        Places: L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
            layers: 'OSM-Overlay-WMS'
        })
    };

    L.control.layers(baseMaps).addTo(map);
    baseMaps.Topography.addTo(map); // default

    const markers = [
        [-37.699450, 176.279420],
        [-27.643310, 153.305140],
        [-33.956330, 122.150270],
        [-34.962390, 117.391220],
        [-17.961210, 122.214820],
        [-16.505960, 151.751520],
        [-22.594400, 167.484440],
        [-37.977000, 177.057000],
        [-41.037600, 173.017000],
        [-37.670300, 176.212000]
    ];

    markers.forEach(coords => L.marker(coords).addTo(map));
});

