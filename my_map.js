

// ///////////////////////
// ADDING VECTOR LAYERS //
/////////////////////////

    // Adding My Own wfs Data
////////////////////////////////////////
var fill = new ol.style.Fill({
    color: 'rgba(0,0,0,0.2)'
    });
var stroke = new ol.style.Stroke({
    color: 'rgba(0,0,0,0.4)'
    });
var circle = new ol.style.Circle({
    radius: 6,
    fill: fill,
    stroke: stroke
    });
var vectorStyle = new ol.style.Style({
    fill: fill,
    stroke: stroke,
    image: circle
});



var rSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function (extent) {
    return (
    'http://services.land.vic.gov.au/catalogue/publicproxy/guest/dv_geoserver/datavic/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=datavic:VMADMIN_LGA_POLYGON&outputFormat=application/json&SRSNAME=EPSG:4283&cql_filter=LGA_CODE=325' +
   'bbox=' + extent.join(',') + ',EPSG:3857');
    },
    strategy: ol.loadingstrategy.bbox,
});


var garbage = new ol.layer.Vector({
    title: 'garbage wfs',
    source: rSource,
    style: vectorStyle
}); //Failed to load data


// ///////////////////////
// ADDING WMS LAYERS //
/////////////////////////

// Defining the Public Roads in the City of Greater Bendigo as layer:
var roads = new ol.layer.Image({
    source: new ol.source.ImageWMS({
    url:
    'https://data.gov.au/geoserver/city-of-greater-bendigo-assets-register-of-public-roads/wms',
    params: {'LAYERS': 'ckan_52a242bd_efc7_4412_86ac_fd486d74bae6'}
    }),
    title: 'Public Roads',
    opacity: 0.5,
});


// Defining Preschools and Childcare Centres in the City of Greater Bendigo:
var childcare = new ol.layer.Image({
    source: new ol.source.ImageWMS({
    url:
    'https://data.gov.au/geoserver/city-of-greater-bendigo-community-preschools-and-childcare-centres/wms',
    params: {'LAYERS': 'ckan_652dd8d6_5dcf_475c_8dbb_a32ad5dfc9f8'}
    }),
    title: 'Preschools and Childcare Centres',
    opacity: 0.5
});


// Defining Recreation - Playspaces
//////////////////////////
var recreation = new ol.layer.Image({
    source: new ol.source.ImageWMS({
    url:
    'https://data.gov.au/geoserver/city-of-greater-bendigo-recreation-playspaces/wms',
    params: {'LAYERS': 'ckan_dfcd7012_576e_40ab_825b_67d5140a4e63'}
    }),
    title: 'Recreation - Playspaces',
    opacity: 1
});


// Defining Garbage Collection zones 
var garbage_collection = new ol.layer.Image({
    source: new ol.source.ImageWMS({
    url:
    'https://data.gov.au/geoserver/greater-bendigo-garbage-collection-zones/wms',
    params: {'LAYERS': 'ckan_c2f141ec_a3ac_4b42_a397_ba5ed0c5da46'}
    }),
    title: 'Garbage Collection Zones',
    opacity: 0.5
});

 
// ////////////////////////
// DEFINING BASE MAPPING //
// ////////////////////////


//Defining Australian Landcover Map as a source of tiles
var landSource = new ol.source.TileWMS({
    url: 'https://ows.dea.ga.gov.au/?service=WMS&version=1.3.0',
    params: {
    LAYERS: 'ga_ls_landcover_descriptors',},
    attributions: [new ol.Attribution({html: 'DEA Land Cover Environmental Descriptors Land cover <br> is the observed physical cover on the Earth surface including trees <br> shrubs, grasses, soils, exposed rocks, water bodies, plantations,<br> crops and built structures. A consistent Australia-wide land<br> cover product helps the understanding of how the different <br> parts of the environment change and inter-relate. <br> Earth observation data recorded over a period of time allows <br> the observation of the state of land cover at specific times<br> and therefore the way that land cover changes. <br> <a href="https://ows.dea.ga.gov.au/">Digital Earth Australia</a>'})]
});


// Defining the landcover as a layer:
var landcover = new ol.layer.Tile({
    title: 'DEA Land Cover Environmental Descriptors',
    type: 'base',
    source: landSource
});


//Defining Australian landsat Map as a source of tiles
var landsatSource = new ol.source.TileWMS({
    url: 'https://ows.dea.ga.gov.au/wms?',
    params: {
    LAYERS: 'landsat_barest_earth'},
    attributions: [new ol.Attribution({html: 'Barest Earth (Landsat) An estimate of the spectra of the barest state <br>(i.e., least vegetation) observed from imagery of the Australian continent <br>collected by the Landsat 5, 7, and 8 satellites over a period of more <br>than 30 years (1983 - 2018). <br>The bands include BLUE (0.452 - 0.512), GREEN (0.533 - 0.590), <br>RED, (0.636 - 0.673) NIR (0.851 - 0.879), SWIR1 (1.566 - 1.651) <br>and SWIR2 (2.107 - 2.294) wavelength regions. <br> <a href="https://ows.dea.ga.gov.au/">Digital Earth Australia</a>'})]
});

// Defining the landsat mapping as a layer:
var land = new ol.layer.Tile({
    title: 'Barest Earth (Landsat)',
    type: 'base',
    source: landsatSource
});


// Defining Open Street Map as a source of tiles:
var osmTiles = new ol.source.OSM();

// Defining Open Street Map as a layer:
var osmBase = new ol.layer.Tile({
    source: osmTiles,
    title: 'Modern',
    type: 'base'
});
// ///////////////////
// CREATING THE MAP //
// ///////////////////

// Define an overview map as a control:
var overviewMapControl = new ol.control.OverviewMap({
    layers: [landcover, land, osmBase],
    collapsed: false
});

// Creating the map:
var map = new ol.Map({
    controls: ol.control.defaults().extend([overviewMapControl]),
    view: new ol.View({
    center: [16071965, -4394253],
    zoom: 11 }),
    layers: [landcover, land, osmBase, garbage_collection, roads, recreation, childcare, ],
    target: 'js-map'
});

// Adding the layer switcher control:
var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Layers' // Optional label for button
});
map.addControl(layerSwitcher);

// map.addLayer(garbage)


////////////////////////
//Collapsible button in side panel
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}


