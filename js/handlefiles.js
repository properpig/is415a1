window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];

      var ext = file.name.split('.').pop();

      var name = file.name.split('.')[0];

      if (ext === "geojson" || ext === "json") {
        var reader = new FileReader();

        reader.onload = function(e) {
          // fileDisplayArea.innerText = reader.result;
          var content = JSON.parse(reader.result);
          // console.log(content);
          mapLayers[name] = new L.geoJson(content, {
            onEachFeature: function(feature, layer) {
              output = "<table width='100%'>";
              for (var thing in feature.properties) {
                output += "<tr><td>" + thing + "</td><td>" + feature.properties[thing] + "</td></tr>";
              }
              output += "</table>"
              layer.bindPopup(output, {
                minWidth: 340,
                maxWidth: 340
              });
              layer.on({
                  mouseover: function(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 3,
                        color: '#9c9c9c',
                        dashArray: '',
                        fillOpacity: 0.4
                    });

                    if (!L.Browser.ie && !L.Browser.opera) {
                        layer.bringToFront();
                    }
                  },
                  mouseout: function(e) {
                    layer.setStyle({
                        fillColor: "#f8ffbe",
                        weight: 2,
                        opacity: 1,
                        color: '#9c9c9c',
                        dashArray: '',
                        fillOpacity: 0
                    });
                  }
              });
            },
            style: {
              fillColor: "#f8ffbe",
              weight: 2,
              opacity: 1,
              color: '#9c9c9c',
              dashArray: '',
              fillOpacity: 0
            },
          });

          mapLayers[name].addTo(map);
          listitem = "<li id=\"" + name + "\"><img src=\"img/user.png\" />" + name + "<span class=\"controls\"><img class=\"visible on\" src=\"img/eye.png\" /><img class=\"zoom\" src=\"img/magnify.png\" /></span></li>";
          $("#userDefined").append($(listitem));

          // bind an event to allow users to zoom to map extent
          $("#" + name + " .zoom").click(function(event){
            var mapID = $(this).parent().parent().attr('id');
            map.fitBounds(mapLayers[mapID].getBounds());
          });

          // bind an event to allow users to on/off a layer
          $("#" + name + " .visible").click(function(event){
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

        }

        reader.readAsText(file);

      } else if (ext === "topojson") {
        var reader = new FileReader();
        var content = JSON.parse(reader.result);
        reader.onload = function(e) {
          // console.log(content);
          mapLayers[name] = new L.TopoJSON(content, {
            onEachFeature: function(feature, layer) {
              output = "<table width='100%'>";
              for (var thing in feature.properties) {
                output += "<tr><td>" + thing + "</td><td>" + feature.properties[thing] + "</td></tr>";
              }
              output += "</table>"
              layer.bindPopup(output, {
                minWidth: 340,
                maxWidth: 340
              });
              layer.on({
                  mouseover: function(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 3,
                        color: '#9c9c9c',
                        dashArray: '',
                        fillOpacity: 0.4
                    });

                    if (!L.Browser.ie && !L.Browser.opera) {
                        layer.bringToFront();
                    }
                  },
                  mouseout: function(e) {
                    layer.setStyle({
                        fillColor: "#f8ffbe",
                        weight: 2,
                        opacity: 1,
                        color: '#9c9c9c',
                        dashArray: '',
                        fillOpacity: 0
                    });
                  }
              });
            },
            style: {
              fillColor: "#f8ffbe",
              weight: 2,
              opacity: 1,
              color: '#9c9c9c',
              dashArray: '',
              fillOpacity: 0
            },
          });

          mapLayers[name].addTo(map);
          listitem = "<li id=\"" + name + "\"><img src=\"img/user.png\" />" + name + "<span class=\"controls\"><img class=\"visible on\" src=\"img/eye.png\" /><img class=\"zoom\" src=\"img/magnify.png\" /></span></li>";
          $("#userDefined").append($(listitem));

          // bind an event to allow users to zoom to map extent
          $("#" + name + " .zoom").click(function(event){
            var mapID = $(this).parent().parent().attr('id');
            map.fitBounds(mapLayers[mapID].getBounds());
          });

          // bind an event to allow users to on/off a layer
          $("#" + name + " .visible").click(function(event){
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

        }

        reader.readAsText(file);
      } else if (ext === "zip") {
          var reader = new FileReader();
          var content = reader.result;
          reader.onload = function(e) {
            mapLayers[name] = new L.Shapefile(content, {
              onEachFeature: function(feature, layer) {
                output = "<table width='100%'>";
                for (var thing in feature.properties) {
                  output += "<tr><td>" + thing + "</td><td>" + feature.properties[thing] + "</td></tr>";
                }
                output += "</table>"
                layer.bindPopup(output, {
                  minWidth: 340,
                  maxWidth: 340
                });
                layer.on({
                    mouseover: function(e) {
                      var layer = e.target;

                      layer.setStyle({
                          weight: 3,
                          color: '#9c9c9c',
                          dashArray: '',
                          fillOpacity: 0.4
                      });

                      if (!L.Browser.ie && !L.Browser.opera) {
                          layer.bringToFront();
                      }
                    },
                    mouseout: function(e) {
                      layer.setStyle({
                          fillColor: "#f8ffbe",
                          weight: 2,
                          opacity: 1,
                          color: '#9c9c9c',
                          dashArray: '',
                          fillOpacity: 0
                      });
                    }
                });
              },
              style: {
                fillColor: "#f8ffbe",
                weight: 2,
                opacity: 1,
                color: '#9c9c9c',
                dashArray: '',
                fillOpacity: 0
              },
            });

            mapLayers[name].addTo(map);
            listitem = "<li id=\"" + name + "\"><img src=\"img/user.png\" />" + name + "<span class=\"controls\"><img class=\"visible on\" src=\"img/eye.png\" /><img class=\"zoom\" src=\"img/magnify.png\" /></span></li>";
            $("#userDefined").append($(listitem));

            // bind an event to allow users to zoom to map extent
            $("#" + name + " .zoom").click(function(event){
              var mapID = $(this).parent().parent().attr('id');
              map.fitBounds(mapLayers[mapID].getBounds());
            });

            // bind an event to allow users to on/off a layer
            $("#" + name + " .visible").click(function(event){
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
          }


        reader.readAsText(file);
      } else {
        $("#userDefined").append("<li>File not supported</li>");
      }
    });
}
