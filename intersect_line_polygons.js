////////////////////////////////////////////////////////////////////////////////////////////
// http://gis.stackexchange.com/questions/170919/how-to-tell-if-a-geojson-path-intersects-with-another-feature-in-leaflet
// http://fiddle.jshell.net/tyt4oeux/1/
//setting up the map//
////////////////////////////////////////////////////////////////////////////////////////////

// set center coordinates
var centerlat = 34;
var centerlon = -118.25;

// set default zoom level
var zoomLevel = 10;

// initialize map
var map = L.map('map', {
    zoomControl: false
}).setView([centerlat, centerlon], zoomLevel);

// set source for map tiles (in this case one of Mapbox's minimal example maps)
MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';

MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

// add tiles to map
L.tileLayer(MB_URL, {
    attribution: MB_ATTR,
    id: 'examples.map-szwdot65'
}).addTo(map);

////////////////////////////////////////////////////////////////////////////////////////////
//some geometry to test against//
////////////////////////////////////////////////////////////////////////////////////////////

var poly = {
    "type": "MultiPolygon",
        "coordinates": [
        [
            [
                [-118.2, 34],
                [-118.3, 34],
                [-118.3, 34.10],
                [-118.2, 34.10],
                [-118.2, 34]
            ]
        ],
        [
            [
                [-118.5, 33.75],
                [-118, 33.75],
                [-118, 34.25],
                [-118.5, 34.25],
                [-118.5, 33.75]
            ],
            [
                [-118.1, 33.85],
                [-118.4, 33.85],
                [-118.4, 34.15],
                [-118.1, 34.15],
                [-118.1, 33.85]
            ]
        ]
    ]
}

////////////////////////////////////////////////////////////////////////////////////////////
//Leaflet layers and controls//
////////////////////////////////////////////////////////////////////////////////////////////

var polyLayer = L.geoJson(poly).addTo(map),
    drawGroup = L.geoJson().addTo(map),
    drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawGroup
        },
        draw: {
            circle: false,
            marker: false
        }
    }).addTo(map);

////////////////////////////////////////////////////////////////////////////////////////////
//draw event handlers//
////////////////////////////////////////////////////////////////////////////////////////////

map.on('draw:created', function (e) {
    //check for intersections between draw layer and base geometry
    var checked = crossCheck(polyLayer, e.layer);
    //add intersection points to map
    L.geoJson(checked, {
        style: {
            color: "red",
            opacity: 1
        }
    }).addTo(map);
    drawGroup.addLayer(e.layer);
});

map.on('overlayadd', function () {
    drawGroup.bringToFront();
});

////////////////////////////////////////////////////////////////////////////////////////////
//intersection and geometry conversion functions//
////////////////////////////////////////////////////////////////////////////////////////////

function crossCheck(baseLayer, drawLayer) {

    var intersection, result = [];

    polyLayer.eachLayer(function (layer) {
        intersection = turf.intersect(layer.toGeoJSON(), drawLayer.toGeoJSON());

        if (intersection) {
            result.push(intersection);
        }
    });

    if (result.length) {
        console.log("found " + JSON.stringify(result));
    } else {
        console.log("nothing found");
    }

    return result;
}