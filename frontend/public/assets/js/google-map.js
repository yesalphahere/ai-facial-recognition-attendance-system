// **------Terrain Type map**
try {
    const terrainMap = new GMaps({
        div: '#mapTypes',
        lat: -12.043333,
        lng: -77.028333,
        mapTypeControlOptions: {
            mapTypeIds: ['terrain']
        }
    });

    terrainMap.addMapType('osm', {
        getTileUrl: function (coord, zoom) {
            return `https://a.tile.openstreetmap.org/${zoom}/${coord.x}/${coord.y}.png`;
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'OpenStreetMap',
        maxZoom: 20
    });

    terrainMap.setMapTypeId('terrain');
} catch (err) {
    console.error('Error initializing terrain map:', err);
}


// **------Satellite Type map**
try {
    const satellite = new GMaps({
        div: '#mapTypes1',
        lat: -12.043333,
        lng: -77.028333,
        mapTypeControlOptions: {
            mapTypeIds: ['satellite']
        }
    });

    satellite.addMapType('osm', {
        getTileUrl: function (coord, zoom) {
            return `https://a.tile.openstreetmap.org/${zoom}/${coord.x}/${coord.y}.png`;
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'OpenStreetMap',
        maxZoom: 18
    });

    satellite.setMapTypeId('satellite');
} catch (err) {
    console.error('Error initializing satellite map:', err);
}


// **------Polygons**
try {
    const Polygons = new GMaps({
        el: '#map-types',
        lat: -12.043333,
        lng: -77.028333
    });

    const path = [
        [-12.040397656836609, -77.03373871559225],
        [-12.040248585302038, -77.03993927003302],
        [-12.050047116528843, -77.02448169303511],
        [-12.044804866577001, -77.02154422636042]
    ];

    Polygons.drawPolygon({
        paths: path,
        strokeColor: '#BBD8E9',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#BBD8E9',
        fillOpacity: 0.6
    });
} catch (err) {
    console.error('Error initializing polygons map:', err);
}


const mapConfigurations = [
    { selector: '#g-map', lat: -12.043333, lng: -77.028333, clickMessage: 'You clicked marker' },
    { selector: '#mapMarkers', lat: -12.043333, lng: -77.028333, clickMessage: 'You clicked marker' },
    { selector: '#mapOverlays', lat: -12.043333, lng: -77.028333, overlayContent: '<div class="map-overlay">Map<div class="overlay-arrow above"></div></div>' }
];

mapConfigurations.forEach(config => {
    try {
        const map = new GMaps({
            el: config.selector,
            lat: config.lat,
            lng: config.lng,
            click: function () {
                alert(config.clickMessage);
            }
        });

        if (config.overlayContent) {
            map.drawOverlay({
                content: config.overlayContent
            });
        }

        if (config.selector === '#mapmarkers') {
            map.addMarker({
                lat: config.lat,
                lng: config.lng,
                title: 'Gmap',
                click: function () {
                    alert(config.clickMessage);
                }
            });
        }
    } catch (err) {
        console.error(`Error initializing map for ${config.selector}:`, err);
    }
});
