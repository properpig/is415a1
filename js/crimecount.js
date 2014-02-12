function loadCrimeCountLayer() {

  $.getJSON('data/crimecount.json', function(crimeData) {

    var crimeOptions = {
      recordsField: null,
      latitudeField: 'location.1',
      longitudeField: 'location.0',
      chartOptions: {
        'property': {
          displayName: 'Property Crimes',
          color: 'hsl(113,100%,25%) ',
          fillColor: 'hsl(113,80%,75%)',
        },
        'violent': {
          displayName: 'Violent Crimes',
          color: 'hsl(6,100%,25%)',
          fillColor: 'hsl(6,80%,75%)',
        },
        'qol': {
          displayName: '"Quality of Life" Crimes',
          color: 'hsl(240,100%,25%)',
          fillColor: 'hsl(240,80%,75%)',
        },
        'others': {
          displayName: 'Others',
          color: 'hsl(76,100%,25%)',
          fillColor: 'hsl(76,80%,75%)',
        }
      },
      layerOptions: {
        fillOpacity: 1,
        opacity: 1,
        weight: 1,
        radius: 25,
        barThickness: 15
      },
      tooltipOptions: {
        iconSize: new L.Point(120,80),
        iconAnchor: new L.Point(-5,60)
      },
      onEachRecord: function (layer,record) {

        html = "<div><table width='310'><col width='280'><col width='30'><tr><td><b><img style='vertical-align:middle' src='img/marker-icon-violent.png' /> Violent Crimes (" + parseFloat((record.subtotals.violent/record.total)*100).toFixed(0) + "%)</b></td><td><b>" + record.subtotals.violent + "</b></td></tr>";
        for (var category in record.breakdown.violent) {
          html += "<tr><td>" + category + "</td><td>" + record.breakdown.violent[category] + "</td></tr>";
        }
        html += "</table>";

        html += "<div><table width='310'><col width='280'><col width='30'><tr><td><b><img style='vertical-align:middle' src='img/marker-icon-property.png' /> Property Crimes (" + parseFloat((record.subtotals.property/record.total)*100).toFixed(0) + "%)</b></td><td><b>" + record.subtotals.property + "</b></td></tr>";
        for (var category in record.breakdown.property) {
          html += "<tr><td>" + category + "</td><td>" + record.breakdown.property[category] + "</td></tr>";
        }
        html += "</table>";

        html += "<div><table width='310'><col width='280'><col width='30'><tr><td><b><img style='vertical-align:middle' src='img/marker-icon-qol.png' /> \"Quality of Life\" Crimes (" + parseFloat((record.subtotals.qol/record.total)*100).toFixed(0) + "%)</b></td><td><b>" + record.subtotals.qol + "</b></td></tr>";
        for (var category in record.breakdown.qol) {
          html += "<tr><td>" + category + "</td><td>" + record.breakdown.qol[category] + "</td></tr>";
        }
        html += "</table>";

        html += "<div><table width='310'><col width='280'><col width='30'><tr><td><b><img style='vertical-align:middle' src='img/marker-icon-others.png' /> Other Crimes (" + parseFloat((record.subtotals.others/record.total)*100).toFixed(0) + "%)</b></td><td><b>" + record.subtotals.others + "</b></td></tr>";
        for (var category in record.breakdown.others) {
          html += "<tr><td>" + category + "</td><td>" + record.breakdown.others[category] + "</td></tr>";
        }
        html += "</table>";

        html += "</div>";
        $html = $(html);

        layer.bindPopup($html.wrap('<div/>').parent().html(),{
          minWidth: 340,
          maxWidth: 340
        });
      },
      legendOptions: {
        title: 'Crime Count by Category'
      }
    };

    mapLayers.crimeProportionalSymbolLayer = new L.PieChartDataLayer(crimeData,crimeOptions);

    map.addLayer(mapLayers.crimeProportionalSymbolLayer);

    // mapLayers.barChartMarker = new L.BarChartMarker(new L.LatLng(0, 0), options);
    // map.addLayer(mapLayers.barChartMarker);
    // map.fitBounds(mapLayers.crimeProportionalSymbolLayer.getBounds());

  });

}