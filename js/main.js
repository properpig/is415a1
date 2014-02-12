//global variables
var map; //map object
var mapLayers;

//begin script when window loads
window.onload = initialize(); //->

//the first function called once the html is loaded
function initialize(){
  //<-window.onload
  setMap(); //->
};

//set basemap parameters
function setMap() {
  //<-initialize()

  //create  the map and set its initial view
  map = L.map('map').setView([37.75836565758392, -122.43996620178221], 13);
  // map = L.map('map').setView([37.7777,-122.4407], 13);

  // indicate the scale of the map
  L.control.scale().addTo(map);

  //create the object storing all map layers
  mapLayers = {};

  //add the tile layer to the map
  mapLayers.baseLayer = L.tileLayer(
    'http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/77922/256/{z}/{x}/{y}.png',
    {
		  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'
	 }).addTo(map);

  mapLayers.baseLayer.name = "Base Layer";

  // Schools
  var schoolMarker = L.AwesomeMarkers.icon({
    prefix: 'fa',
    icon: 'fa-book',
    markerColor: 'blue'
  });

  mapLayers.schoolsLayer = new L.Shapefile('data/schools_public_pt.zip',{
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: schoolMarker});
    },
    onEachFeature:function(feature, layer) {
      if (feature.properties) {
        layer.bindPopup(feature.properties.FACILITY_N + " (" + feature.properties.SCHOOL_TYP);
      }
    }
  });

  // Crime data
  mapLayers.crimeMarkers = new L.MarkerClusterGroup();

  //Extend the Default marker class
  var CrimeMarkerIconQol = L.Icon.Default.extend({
    options: {
       iconUrl: 'img/marker-icon-qol.png'
    }
  });

  var CrimeMarkerIconProperty = L.Icon.Default.extend({
    options: {
       iconUrl: 'img/marker-icon-property.png'
    }
  });

  var CrimeMarkerIconViolent = L.Icon.Default.extend({
    options: {
       iconUrl: 'img/marker-icon-violent.png'
    }
  });

  var CrimeMarkerIconOthers = L.Icon.Default.extend({
    options: {
       iconUrl: 'img/marker-icon-others.png'
    }
  });

  var crimeMarkerIconQol = new CrimeMarkerIconQol();
  var crimeMarkerIconProperty = new CrimeMarkerIconProperty();
  var crimeMarkerIconViolent = new CrimeMarkerIconViolent();
  var crimeMarkerIconOthers = new CrimeMarkerIconOthers();

  // determine which icon to display
  function iconStyle(feature) {
    var c = feature.properties.category;
    return c === "ASSAULT" ? crimeMarkerIconViolent :
           c === "ROBBERY"  ? crimeMarkerIconViolent :
           c === "KIDNAPPING"  ? crimeMarkerIconViolent :
           c === "VANDALISM"  ? crimeMarkerIconProperty :
           c === "VEHICLE THEFT"   ? crimeMarkerIconProperty :
           c === "LARCENY/THEFT"   ? crimeMarkerIconProperty :
           c === "BURGLARY"   ? crimeMarkerIconProperty :
           c === "ARSON"   ? crimeMarkerIconProperty :
           c === "TRESPASS"   ? crimeMarkerIconProperty :
           c === "PROSTITUTION"   ? crimeMarkerIconQol :
           c === "DRUNKENNESS"   ? crimeMarkerIconQol :
           c === "DRUG/NARCOTIC"   ? crimeMarkerIconQol :
           c === "DRIVING UNDER THE INFLUENCE"   ? crimeMarkerIconQol :
           c === "WEAPON LAWS"   ? crimeMarkerIconQol :
           c === "SEX OFFENSES, NON FORCIBLE"   ? crimeMarkerIconQol :
           c === "SEX OFFENSES, FORCIBLE"   ? crimeMarkerIconQol :
           c === "GAMBLING"   ? crimeMarkerIconQol :
           c === "DISORDERLY CONDUCT"   ? crimeMarkerIconQol :
                                 crimeMarkerIconOthers;
  }

  $.get('data/crime.csv', function(csvContents) {
    var crimeLayer = L.geoCsv(csvContents, {
      firstLineTitles: true,
      fieldSeparator: ',',
      pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: iconStyle(feature) });
      },
      onEachFeature: function (feature, layer) {
        html = "<table width='400'><col width='100'><col width='300'><tr><td><b>Incident No.</b></td><td><b>" + feature.properties.incidntnum + "</b></td></tr><tr><td>Category</td><td>" + feature.properties.category + "</td></tr><tr><td>Description</td><td>" + feature.properties.descript + "</td></tr><tr><td>Date</td><td>" + feature.properties.date + ", " + feature.properties.dayofweek + " " + feature.properties.time + "</td></tr><tr><td>Resolution</td><td>" + feature.properties.resolution + "</td></tr><tr><td>Address</td><td>" + feature.properties.address + "</td></tr></table>";
        layer.bindPopup(html);
      }
    });

    mapLayers.crimeMarkers.addLayer(crimeLayer);
    mapLayers.crimeMarkers.addTo(map);
  });

  mapLayers.crimeMarkers.name = "Crimes Point Data";



  // Roads

  function roadStyle(feature) {
    // primary road
    if (feature.properties.MTFCC == "S1100") {
      return {
        weight: 2,
        opacity: 0.3,
        color: '#ffb8b8',
        dashArray: '1',
      };
    }
    // secondary road
    if (feature.properties.MTFCC == "S1200") {
      return {
        weight: 2,
        opacity: 0.3,
        color: '#b8ecff',
        dashArray: '1',
      };
    }
    // local neighborhood road, rural road, city street
    if (feature.properties.MTFCC == "S1400") {
      return {
        weight: 2,
        opacity: 0.3,
        color: '#fffeec',
        dashArray: '1',
      };
    }
    // walkway/pedestrain trail
    if (feature.properties.MTFCC == "S1710") {
      return {
        weight: 2,
        opacity: 0.3,
        color: '#b3ffb1',
        dashArray: '1',
      };
    }
    // the rest
    return {
      weight: 2,
      opacity: 0.4,
      color: 'white',
      dashArray: '2',
    };
  }

  mapLayers.roadsLayer = new L.Shapefile('data/roads.zip',{
    style: roadStyle,
    onEachFeature:function(feature, layer) {
      if (feature.properties) {
        layer.bindPopup(feature.properties.FULLNAME);
      }
    }
  });

  mapLayers.roadsLayer.name = "Roads Layer";

  // zoom to the particular area (for polygon layers)
  function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
  }

  // police department districts
  $.getJSON('data/sfpd_districts.geojson', function(data) {
    mapLayers.sfpdDistrictsLayer = new L.geoJson(data, {
      style: {
          weight: 1,
          opacity: 1,
          color: '#b7dcff',
          dashArray: '3',
          fillOpacity: 0
      },
      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(e) {
              var layer = e.target;

              layer.setStyle({
                  weight: 3,
                  color: '#b7dcff',
                  dashArray: '',
                  fillOpacity: 0.7
              });

              if (!L.Browser.ie && !L.Browser.opera) {
                  layer.bringToFront();
              }
            },
            mouseout: function(e) {
              layer.setStyle({
                  weight: 1,
                  color: '#b7dcff',
                  dashArray: '3',
                  fillOpacity: 0
              });
            },
            click: zoomToFeature
        });
      }
    });

    // mapLayers.sfpdDistrictsLayer.addTo(map);

  });

  // zip code boundaries
  $.getJSON('data/zipcodes.geojson', function(data) {
    mapLayers.zipCodeBoundariesLayer = new L.geoJson(data, {
      style: {
          weight: 1,
          opacity: 1,
          color: '#ffeea9',
          dashArray: '3',
          fillOpacity: 0
      },
      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(e) {
              var layer = e.target;

              layer.setStyle({
                  weight: 3,
                  color: '#ffeea9',
                  dashArray: '',
                  fillOpacity: 0.7
              });

              if (!L.Browser.ie && !L.Browser.opera) {
                  layer.bringToFront();
              }
            },
            mouseout: function(e) {
              layer.setStyle({
                  weight: 1,
                  color: '#ffeea9',
                  dashArray: '3',
                  fillOpacity: 0
              });
            },
            click: zoomToFeature
        });
      }
    });

    // mapLayers.zipCodeBoundariesLayer.addTo(map);

  });

  // crime count layer
  var crimeColour = d3.scale.linear()
    .domain([500, 1800])
    .range(["white", "#c61313"]);

  $.getJSON('data/crimecount2.geojson', function(data) {
    mapLayers.crimeCountLayer = new L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("ZIP Code " + feature.properties.ZIP_CODE + ": " + feature.properties.COUNT + " crimes");
      },
      style: function(feature) {
          return {
            fillColor: crimeColour(feature.properties.COUNT),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
          }
      },
    });

    mapLayers.crimeCountLayer.legend = L.control({position: 'bottomright'});

    mapLayers.crimeCountLayer.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend panel');

        div.innerHTML +=
          '<center><h4>Crime Count (by ZIP)</h4></center>' +
          '<i style="background:' + crimeColour(500) + '"></i> 500 - 716 <br />' +
          '<i style="background:' + crimeColour(717) + '"></i> 717 - 932 <br />' +
          '<i style="background:' + crimeColour(933) + '"></i> 933 - 1148 <br />' +
          '<i style="background:' + crimeColour(1149) + '"></i> 1149 - 1364 <br />' +
          '<i style="background:' + crimeColour(1365) + '"></i> 1365 - 1580 <br />' +
          '<i style="background:' + crimeColour(1581) + '"></i> 1581 - 1800 <br />';

      return div;
    };
    // map.removeControl(mapLayers.legend)

  });

  var crimeColourDistrict = d3.scale.linear()
    .domain([0, 1300])
    .range(["white", "#c61313"]);

  $.getJSON('data/crimebydistrict.geojson', function(data) {
    mapLayers.crimeCountDistrictLayer = new L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.DISTRICT + " DISTRICT: " + feature.properties.COUNT + " crimes");
      },
      style: function(feature) {
          return {
            fillColor: crimeColourDistrict(feature.properties.COUNT),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
          }
      },
    });

    mapLayers.crimeCountDistrictLayer.addTo(map);

    mapLayers.crimeCountDistrictLayer.legend = L.control({position: 'bottomright'});

    mapLayers.crimeCountDistrictLayer.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend panel');

        div.innerHTML +=
          '<center><h4>Crime Count (by District)</h4></center>' +
          '<i style="background:' + crimeColour(0) + '"></i> 0 - 216 <br />' +
          '<i style="background:' + crimeColour(217) + '"></i> 217 - 432 <br />' +
          '<i style="background:' + crimeColour(433) + '"></i> 433 - 648 <br />' +
          '<i style="background:' + crimeColour(649) + '"></i> 649 - 864 <br />' +
          '<i style="background:' + crimeColour(865) + '"></i> 865 - 1080 <br />' +
          '<i style="background:' + crimeColour(1080) + '"></i> 1080 - 1300 <br />';

      return div;
    };

    mapLayers.crimeCountDistrictLayer.legend.addTo(map);

  });

  // school count layer
  var schoolColour = d3.scale.linear()
    .domain([0, 20])
    .range(["white", "#197ad4"]);

  $.getJSON('data/schoolcount.geojson', function(data) {
    mapLayers.schoolCountLayer = new L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("ZIP Code " + feature.properties.ZIP_CODE + ": " + feature.properties.COUNT + " schools ");
      },
      style: function(feature) {
          return {
            fillColor: schoolColour(feature.properties.COUNT),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
          }
      },
    });

    // mapLayers.schoolCountLayer.addTo(map);

    mapLayers.schoolCountLayer.legend = L.control({position: 'bottomright'});

    mapLayers.schoolCountLayer.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend panel');

        div.innerHTML +=
          '<center><h4>School Count</h4></center>' +
          '<i style="background:' + schoolColour(0) + '"></i> 0 - 3 <br />' +
          '<i style="background:' + schoolColour(4) + '"></i> 4 - 6 <br />' +
          '<i style="background:' + schoolColour(7) + '"></i> 7 - 10 <br />' +
          '<i style="background:' + schoolColour(11) + '"></i> 11 - 13 <br />' +
          '<i style="background:' + schoolColour(14) + '"></i> 14 - 16 <br />' +
          '<i style="background:' + schoolColour(17) + '"></i> 17 - 20 <br />';

      return div;
    };

    // mapLayers.schoolCountLayer.legend.addTo(map);

  });

  // median income layer
  var incomeColour = d3.scale.linear()
    .domain([43000, 106000])
    .range(["white", "#72c200"]);

  $.getJSON('data/income.geojson', function(data) {
    mapLayers.incomeLevelLayer = new L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("ZIP Code " + feature.properties.ZIP_CODE + " Median Income: $" + parseFloat(feature.properties.MedInc_d).toFixed(0));
      },
      style: function(feature) {
          return {
            fillColor: incomeColour(feature.properties.MedInc_d),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
          }
      },
    });

    // mapLayers.incomeLevelLayer.addTo(map);

    mapLayers.incomeLevelLayer.legend = L.control({position: 'bottomright'});

    mapLayers.incomeLevelLayer.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend panel');

        div.innerHTML +=
          '<center><h4>Median Income Level</h4></center>' +
          '<i style="background:' + incomeColour(43000.0) + '"></i> $43,000 - $53,499 <br />' +
          '<i style="background:' + incomeColour(53500.0) + '"></i> $53,500 - $63,999 <br />' +
          '<i style="background:' + incomeColour(64000.0) + '"></i> $64,000 - $74,499 <br />' +
          '<i style="background:' + incomeColour(74500.0) + '"></i> $74,500 - $84,999 <br />' +
          '<i style="background:' + incomeColour(85000.0) + '"></i> $85,000 - $95,499 <br />' +
          '<i style="background:' + incomeColour(95500.0) + '"></i> $95,500 - $106,000 <br />';

      return div;
    };

    // mapLayers.incomeLevelLayer.legend.addTo(map);

  });

  // percentage in poverty layer
  var povertyColour = d3.scale.linear()
    .domain([0, 50])
    .range(["white", "#72c200"]);

  $.getJSON('data/poverty.geojson', function(data) {
    mapLayers.povertyLayer = new L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(parseFloat("ZIP Code " + feature.properties.ZIP_CODE + ": " + feature.properties.Pov200_pct).toFixed(2) + "% living in poverty");
      },
      style: function(feature) {
          return {
            fillColor: povertyColour(feature.properties.Pov200_pct),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '',
            fillOpacity: 0.7
          }
      },
    });

    // mapLayers.povertyLayer.addTo(map);

    mapLayers.povertyLayer.legend = L.control({position: 'bottomright'});

    mapLayers.povertyLayer.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend panel');

        div.innerHTML +=
          '<center><h4>% Living in Poverty </h4></center>' +
          '<i style="background:' + povertyColour(0) + '"></i> 0% - 8% <br />' +
          '<i style="background:' + povertyColour(9) + '"></i> 9% - 16% <br />' +
          '<i style="background:' + povertyColour(17) + '"></i> 17% - 25% <br />' +
          '<i style="background:' + povertyColour(26) + '"></i> 26% - 33% <br />' +
          '<i style="background:' + povertyColour(34) + '"></i> 34% - 42% <br />' +
          '<i style="background:' + povertyColour(43) + '"></i> 43% - 50% <br />';

      return div;
    };

    // mapLayers.povertyLayer.legend.addTo(map);

  });


  // Neighborhoods

  mapLayers.neighborhoodLayer = new L.TopoJSON(null);

  $.getJSON('data/neighborhood.topojson', function(topoJsonData) {

    mapLayers.neighborhoodLayer = new L.TopoJSON(topoJsonData, {
      style: {
          weight: 1,
          opacity: 1,
          color: '#c6ffb7',
          dashArray: '3',
          fillOpacity: 0
      },
      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(e) {
              var layer = e.target;

              layer.setStyle({
                  weight: 3,
                  color: '#c6ffb7',
                  dashArray: '',
                  fillOpacity: 0.7
              });

              if (!L.Browser.ie && !L.Browser.opera) {
                  layer.bringToFront();
              }
            },
            mouseout: function(e) {
              layer.setStyle({
                  weight: 1,
                  color: '#c6ffb7',
                  dashArray: '3',
                  fillOpacity: 0
              });
            },
            click: zoomToFeature
        });
      }
    });

    // mapLayers.neighborhoodLayer.addTo(map);

    mapLayers.neighborhoodLayer.name = "Planning Neighborhoods";
  });


  // after everything is loaded, we want to set layer control
  $( document ).one('ajaxStop', function() {
    // mix map for crime count by category
    loadCrimeCountLayer();
    setLayerControl();
  });

};

function setLayerControl() {

  // call the function when a sort has been made
  $( "#sortable" ).sortable({
    stop: function( event, ui ) {}
  });

  $( "#sortable" ).disableSelection();

  // bind an event to the sort trigger
  $( "#sortable" ).on( "sortstop", function( event, ui ) {
    renderLayers();
  });

  // bind an event to allow users to zoom to map extent
  $(".zoom").click(function(event){
    var mapID = $(this).parent().parent().attr('id');
    map.fitBounds(mapLayers[mapID].getBounds());
  });

  $("#sortable li").click(function(event) {
    var mapID = $(this).attr('id');
    // remove all previous controls
    var overlaysWithLegends = ["crimeCountDistrictLayer", "crimeCountLayer", "schoolCountLayer", "incomeLevelLayer", "povertyLayer"];
    for (var i in overlaysWithLegends) {
      try {
        map.removeControl(mapLayers[overlaysWithLegends[i]].legend);
      } catch (err) {
        //do nothing
      }
    }

    // display this one
    mapLayers[mapID].legend.addTo(map);
  });

  // bind an event to allow users to on/off a layer
  $(".visible").click(function(event){
    var mapID = $(this).parent().parent().attr('id');

    // toggle it off
    if ($(this).hasClass('on')) {
      map.removeLayer(mapLayers[mapID]);
      $(this).removeClass('on');
      $(this).addClass('off');
      // have to render layers again
      renderLayers();
    } else {
      // toggie it on
      map.addLayer(mapLayers[mapID]);
      $(this).removeClass('off');
      $(this).addClass('on');
      renderLayers();
    }


  });

  // bind an event to allow change of base layer
  $("#changeBaseLayer").one('click', function() {
    $("#changeBaseLayerModal #77922").css("background", "#b1bdce");
  });

  $("#changeBaseLayer").click(function(){
    // remove all previous controls
    var overlaysWithLegends = ["crimeCountDistrictLayer", "crimeCountLayer", "schoolCountLayer", "incomeLevelLayer", "povertyLayer"];
    for (var i in overlaysWithLegends) {
      try {
        map.removeControl(mapLayers[overlaysWithLegends[i]].legend);
      } catch (err) {
        //do nothing
      }
    }
    $("#changeBaseLayerModal").foundation('reveal', 'open');
  });

  $(".baseLayerOption").click(function(){
    var styleID = $(this).attr('id');
    $(".baseLayerOption").css("background", "");
    $(this).css("background", "#b1bdce");
    changeBaseLayer(styleID);
  });

  renderLayers();

  // console.log(mapLayers);
  // for (var layer in mapLayers) {
  //   $('#layers #sortable').append('<li id="'+layer+'"">'+mapLayers[layer].name+'</li>');
  // }

}

function renderLayers() {

  // loop through the layers in order
  $('#sortable li').each(function() {
    var mapID = $(this).attr('id');
    if (map.hasLayer(mapLayers[mapID])) {
      mapLayers[mapID].bringToBack();
    }
    // console.log("shifted!");
  });
}

function changeBaseLayer(styleID) {
  map.removeLayer(mapLayers.baseLayer);
  mapLayers.baseLayer = L.tileLayer('http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/' + styleID + '/256/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'
  });
  map.addLayer(mapLayers.baseLayer);
}

console.log("My first geoweb mapping application");
